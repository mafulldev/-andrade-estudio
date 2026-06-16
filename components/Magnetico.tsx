"use client";

// Casca magnética para CTAs de destaque (hero e coda): o filho inteiro
// acompanha o ponteiro em ±24px via quickTo (useMagnetico), apenas em
// pointer: fine e sem reduced-motion. O nó magnético é ESTE span; o botão
// interno segue livre para os próprios hovers CSS.

import { type ReactNode, type Ref } from "react";
import { useMagnetico } from "@/components/Botoes";

export default function Magnetico({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useMagnetico();
  return (
    <span
      ref={ref as Ref<HTMLSpanElement>}
      className={className}
      style={{ display: "inline-block" }}
    >
      {children}
    </span>
  );
}
