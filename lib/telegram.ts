// Notificação instantânea por Telegram (opcional por env).
// Sem TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID, o recurso fica desligado sem erro.

export async function notificarTelegram(texto: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) {
    console.log("[telegram] envs ausentes: notificação pulada");
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text: texto }),
    });
  } catch (erro) {
    console.log("[telegram] falha no envio:", erro);
  }
}
