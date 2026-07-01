// Validação do Cloudflare Turnstile no servidor.
// Sem env (dev), a checagem é pulada com aviso no log.

export async function validarTurnstile(
  token: string | null | undefined,
  ip?: string | null,
): Promise<boolean> {
  const segredo = process.env.TURNSTILE_SECRET_KEY;
  if (!segredo) {
    console.log("[turnstile] TURNSTILE_SECRET_KEY ausente: checagem pulada");
    return true;
  }
  if (!token) return false;

  try {
    const corpo = new URLSearchParams({ secret: segredo, response: token });
    if (ip) corpo.set("remoteip", ip);
    const resposta = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: corpo },
    );
    const dados = (await resposta.json()) as { success?: boolean };
    return dados.success === true;
  } catch {
    // indisponibilidade da Cloudflare não pode derrubar a captação; o rate-limit
    // por IP em /api/lead limita o abuso enquanto o Turnstile fica cego
    console.warn(
      "[turnstile] siteverify indisponível: lead aceito sem checagem",
    );
    return true;
  }
}
