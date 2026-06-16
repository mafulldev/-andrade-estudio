// Campos de linha hairline com label flutuante e check circular.

import {
  useId,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

export function CampoLinha({
  rotulo,
  ...props
}: { rotulo: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className="campo">
      <input id={id} placeholder=" " {...props} />
      <label htmlFor={id}>{rotulo}</label>
    </div>
  );
}

export function CampoArea({
  rotulo,
  ...props
}: { rotulo: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className="campo">
      <textarea id={id} placeholder=" " rows={3} {...props} />
      <label htmlFor={id}>{rotulo}</label>
    </div>
  );
}

export function CampoCheck({
  rotulo,
  ...props
}: { rotulo: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="campo-check">
      <input type="checkbox" {...props} />
      <span>{rotulo}</span>
    </label>
  );
}
