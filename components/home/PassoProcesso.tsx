// Um passo do processo, expandido: fotografia 4:5, pictograma autoral,
// número-odômetro, título e os ENTREGÁVEIS da fase (a parte que vende:
// o que o cliente recebe de verdade em cada etapa). Server Component;
// quem anima é a Cena04 (odômetro, DrawSVG do pictograma, reveals).

import Figura from "@/components/Figura";
import { IcChecagem } from "@/components/Icone";
import type { ReactNode } from "react";
import s from "@/app/page.module.css";

export default function PassoProcesso({
  num,
  titulo,
  texto,
  entregaveis,
  figura,
  picto,
}: {
  num: string;
  titulo: string;
  texto: string;
  entregaveis: string[];
  figura: { src: string; alt: string };
  picto: ReactNode;
}) {
  return (
    <div className={s.passo} data-passo>
      <Figura
        src={figura.src}
        alt={figura.alt}
        ratio="4 / 5"
        sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 340px"
        parallax={0.45}
        direcao="baixo"
      />
      <div className={s.passoCabeca}>
        <span className={s.passoNum} data-passo-num>
          {num}
        </span>
        <span className={s.passoPicto}>{picto}</span>
      </div>
      <h3 className={s.passoTitulo}>{titulo}</h3>
      <p className={s.passoTexto}>{texto}</p>
      <ul className={s.passoEntregaveis}>
        {entregaveis.map((e) => (
          <li key={e}>
            <IcChecagem size={14} />
            {e}
          </li>
        ))}
      </ul>
    </div>
  );
}
