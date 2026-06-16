// BASTIDORES: a prova de engenharia. À esquerda, o terminal AUTORAL com a
// saída real do selftest e o close de código; à direita, os seis fatos
// técnicos de como este site foi construído. Server Component.

import Figura from "@/components/Figura";
import {
  IcEmailAuto,
  IcInfra,
  IcRepositorio,
  IcSelftest,
  IcTelegram,
  IcTemas,
} from "@/components/Icone";
import s from "@/app/page.module.css";

const ITENS = [
  {
    icone: <IcInfra />,
    titulo: "Next.js e Supabase em infraestrutura gratuita",
    texto: "A plataforma inteira roda em free tier real, sem custo fixo escondido.",
  },
  {
    icone: <IcSelftest />,
    titulo: "Motor de orçamento com self-test",
    texto: "Quatro cenários auditam o cálculo a cada build; falhou, não publica.",
  },
  {
    icone: <IcEmailAuto />,
    titulo: "Resposta automática por e-mail",
    texto: "Cada diagnóstico vira estimativa enviada com link permanente.",
  },
  {
    icone: <IcTelegram />,
    titulo: "Aviso interno por Telegram",
    texto: "Lead novo chega ao estúdio no segundo em que acontece.",
  },
  {
    icone: <IcTemas />,
    titulo: "Dois temas em OKLCH",
    texto: "Noite e marfim com contraste AA medido por pixel.",
  },
  {
    icone: <IcRepositorio />,
    titulo: "O mesmo padrão entregue ao cliente",
    texto: "O código que roda esta página é o padrão do que sai do estúdio.",
  },
];

export default function Bastidores() {
  return (
    <div className={s.bastidores}>
      <div className={s.bastidoresFiguras}>
        <Figura
          src="/fotos/selftest-terminal.svg"
          alt="Terminal com a saída real do self-test: motor 4 de 4 e verificações estáticas 8 de 8, tudo em PASS"
          vetorial
          ratio="8 / 7"
          parallax={0.4}
          direcao="esquerda"
          legenda="Saída real do self-test, sem retoque"
        />
        <Figura
          src="/fotos/bastidores-codigo.avif"
          alt="Tela de código em ambiente escuro"
          ratio="16 / 10"
          sizes="(max-width: 1100px) 100vw, 640px"
          parallax={0.5}
          direcao="esquerda"
        />
      </div>
      <ul className={s.bastidoresLista}>
        {ITENS.map((item) => (
          <li key={item.titulo} data-bastidores-item>
            <span className={s.bastidoresIcone}>{item.icone}</span>
            <div>
              <h3 className={s.bastidoresTitulo}>{item.titulo}</h3>
              <p className={s.bastidoresTexto}>{item.texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
