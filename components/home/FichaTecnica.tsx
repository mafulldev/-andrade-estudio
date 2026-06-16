// FICHA TÉCNICA: "Medido, não prometido." Linhas hairline com os números
// REAIS deste site, vindos exclusivamente de lib/specs.ts; linha sem data
// de medição não renderiza (honestidade por construção). Server Component;
// a Cena07 roda o odômetro nos valores.

import { SPECS } from "@/lib/specs";
import {
  IcContraste,
  IcPeso,
  IcSelftest,
  IcSemRastreio,
  IcTempo,
  IcZeroErros,
} from "@/components/Icone";
import s from "@/app/page.module.css";

const ICONES: Record<string, React.ReactNode> = {
  "Self-test do motor de orçamento": <IcSelftest />,
  "Contraste dos dois temas": <IcContraste />,
  "Fotografia da página inicial": <IcPeso />,
  "JavaScript inicial da home": <IcTempo />,
  "Erros de console no aceite": <IcZeroErros />,
  "Rastreadores de terceiros": <IcSemRastreio />,
};

const dataCurta = (iso: string) => {
  const [a, m] = iso.split("-");
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${meses[Number(m) - 1]} ${a}`;
};

export default function FichaTecnica() {
  const publicaveis = SPECS.filter((spec) => spec.medidoEm);
  if (publicaveis.length === 0) return null;

  return (
    <div className={s.ficha} data-ficha>
      <svg
        className={s.fichaSvg}
        data-ficha-svg
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="var(--line)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <h3 className={s.fichaTitulo}>Medido, não prometido.</h3>
      <dl className={s.fichaLinhas}>
        {publicaveis.map((spec) => (
          <div className={s.fichaLinha} key={spec.rotulo} data-ficha-linha>
            <dt className={s.fichaRotulo}>
              <span className={s.fichaIcone}>{ICONES[spec.rotulo]}</span>
              {spec.rotulo}
            </dt>
            <dd className={s.fichaValor} data-ficha-valor>
              {spec.valor}
            </dd>
            <dd className={s.fichaDetalhe}>
              {spec.detalhe}
              <span className={s.fichaData}>medido em {dataCurta(spec.medidoEm!)}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className={s.fichaNota}>
        Medições refeitas no aceite de cada publicação deste site e de cada
        projeto entregue.
      </p>
    </div>
  );
}
