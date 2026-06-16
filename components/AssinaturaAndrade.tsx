// Assinatura "Andrade" desenhada à mão como LINHA CURSIVA ÚNICA e fluida (um
// traço só, sem levantar a caneta). É stroke (não preenchimento) para a Cena01
// DESENHAR (DrawSVG) e DEFORMAR com o cursor. data-hero-traco é o alvo.

export default function AssinaturaAndrade({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      data-hero-script
      viewBox="0 0 1000 300"
      role="img"
      aria-label="Andrade"
    >
      <path
        data-hero-traco
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M55 205 C80 120 105 80 130 58 C152 80 168 130 175 150 C145 150 110 150 90 150 C120 150 160 150 185 150 C200 175 210 195 222 205 C222 160 224 120 226 120 C240 120 245 160 248 205 C252 160 260 128 290 122 C312 118 320 140 312 165 C306 185 296 200 300 205 C312 200 322 185 332 165 C322 140 330 118 358 122 C382 126 388 150 378 170 C366 192 340 196 348 170 C354 150 372 128 400 122 C408 80 410 60 412 57 C414 90 414 150 416 205 C420 160 430 128 452 123 C470 119 476 138 470 150 C462 150 456 150 452 150 C458 158 466 178 470 205 C474 160 484 128 512 122 C536 118 542 142 532 165 C520 190 496 196 502 170 C508 150 526 128 554 122 C562 160 562 182 566 205 C570 160 580 128 608 122 C632 118 638 150 628 170 C616 192 590 196 598 170 C604 150 622 128 650 122 C658 80 660 60 662 57 C664 90 664 150 666 205 C670 160 685 124 720 122 C748 120 760 148 748 168 C738 185 712 184 706 168 C700 150 712 134 740 135 C780 137 820 160 870 180 C905 194 935 196 958 188"
      />
    </svg>
  );
}
