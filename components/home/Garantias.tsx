// GARANTIAS: o que TODO projeto carrega, respondendo a objeção no exato
// ponto do preço. Grade hairline 4×2 com ícones lucide e o selo autoral
// desenhável. Server Component; a Cena06 revela as células.

import {
  IcAcessibilidade,
  IcCodigoEntregue,
  IcDominio,
  IcLgpd,
  IcResponsivo,
  IcSeo,
  IcSuporte,
  IcTreinamento,
} from "@/components/Icone";
import { PictoSelo } from "@/components/Pictogramas";
import s from "@/app/page.module.css";

const ITENS = [
  { icone: <IcCodigoEntregue />, titulo: "Código entregue", detalhe: "repositório e instruções, seu de verdade" },
  { icone: <IcDominio />, titulo: "Domínio em seu nome", detalhe: "acessos documentados, nada refém" },
  { icone: <IcLgpd />, titulo: "LGPD desde o primeiro clique", detalhe: "consentimento e canal de exclusão" },
  { icone: <IcSeo />, titulo: "SEO técnico", detalhe: "estrutura, metadados e dados estruturados" },
  { icone: <IcResponsivo />, titulo: "Responsivo auditado", detalhe: "do telefone ao monitor grande" },
  { icone: <IcTreinamento />, titulo: "Treinamento de uso", detalhe: "você opera o que recebeu" },
  { icone: <IcSuporte />, titulo: "Suporte de estreia", detalhe: "acompanhamento no lançamento" },
  { icone: <IcAcessibilidade />, titulo: "Acessibilidade essencial", detalhe: "contraste AA e teclado completo" },
];

export default function Garantias() {
  return (
    <div className={s.garantias} data-garantias>
      <div className={s.garantiasCabeca}>
        <span className={s.garantiasSelo}>
          <PictoSelo size={52} />
        </span>
        <h3 className={s.garantiasTitulo}>Incluso em todo projeto.</h3>
      </div>
      <ul className={s.garantiasGrade}>
        {ITENS.map((item) => (
          <li key={item.titulo} data-garantia>
            <span className={s.garantiaIcone}>{item.icone}</span>
            <span className={s.garantiaTitulo}>{item.titulo}</span>
            <span className={s.garantiaDetalhe}>{item.detalhe}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
