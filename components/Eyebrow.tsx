// Eyebrow numerada da linguagem OURO: caixinha hairline com o número e
// label uppercase, dourados discretos, abrindo toda seção.
// Números nunca acima de 12px.

export default function Eyebrow({
  num,
  children,
  className,
}: {
  num: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`eyebrow ${className ?? ""}`}>
      <span className="eyebrow-num">{num}</span>
      <span className="eyebrow-rotulo">{children}</span>
    </span>
  );
}
