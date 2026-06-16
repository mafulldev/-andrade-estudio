// ÚNICO ponto de import do lucide no app. Defaults da casa: 18px, stroke
// 1.5 ótico (absoluteStrokeWidth), aria-hidden (o texto adjacente fala).
// Regra: lucide vive em listas/grades/fichas em currentColor (muted);
// NUNCA em CTA (território do IcoSetaDireita autoral) e NUNCA em --warm.

import type { LucideIcon, LucideProps } from "lucide-react";
import {
  Accessibility,
  Banknote,
  CalendarClock,
  Check,
  CircleCheck,
  Clock,
  Compass,
  Contrast,
  Database,
  Ear,
  EyeOff,
  Feather,
  FileCode2,
  FlaskConical,
  GitBranch,
  Globe,
  GraduationCap,
  KeyRound,
  Languages,
  Layers,
  LifeBuoy,
  ListChecks,
  Lock,
  MailCheck,
  MapPin,
  MessageCircle,
  MonitorSmartphone,
  PackageCheck,
  PencilRuler,
  SearchCheck,
  Send,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  SunMoon,
  Timer,
} from "lucide-react";

const PADRAO: Partial<LucideProps> = {
  size: 18,
  strokeWidth: 1.5,
  absoluteStrokeWidth: true,
  "aria-hidden": true,
};

function configurar(Icon: LucideIcon) {
  function IconeConfigurado(props: LucideProps) {
    return <Icon {...PADRAO} {...props} />;
  }
  IconeConfigurado.displayName = `Icone(${Icon.displayName ?? "Lucide"})`;
  return IconeConfigurado;
}

/* Garantias */
export const IcCodigoEntregue = configurar(FileCode2);
export const IcDominio = configurar(Globe);
export const IcLgpd = configurar(ShieldCheck);
export const IcSeo = configurar(SearchCheck);
export const IcResponsivo = configurar(MonitorSmartphone);
export const IcTreinamento = configurar(GraduationCap);
export const IcSuporte = configurar(LifeBuoy);
export const IcAcessibilidade = configurar(Accessibility);

/* Bastidores */
export const IcInfra = configurar(Database);
export const IcSelftest = configurar(FlaskConical);
export const IcEmailAuto = configurar(MailCheck);
export const IcTelegram = configurar(Send);
export const IcTemas = configurar(SunMoon);
export const IcRepositorio = configurar(GitBranch);

/* Ficha técnica */
export const IcPeso = configurar(Feather);
export const IcContraste = configurar(Contrast);
export const IcZeroErros = configurar(CircleCheck);
export const IcTempo = configurar(Timer);
export const IcSemRastreio = configurar(EyeOff);

/* Processo */
export const IcEscuta = configurar(Ear);
export const IcProposta = configurar(PencilRuler);
export const IcConstrucao = configurar(SquareTerminal);
export const IcEntrega = configurar(PackageCheck);

/* Projeto real (NeuroCode AI) */
export const IcIa = configurar(Sparkles);
export const IcEscala = configurar(Layers);
export const IcBlindagem = configurar(ShieldCheck);
export const IcFailClosed = configurar(Lock);
export const IcIdiomas = configurar(Languages);

/* Apoio */
export const IcLocal = configurar(MapPin);
export const IcHora = configurar(Clock);
export const IcConversa = configurar(MessageCircle);
export const IcRodadas = configurar(ListChecks);
export const IcCaminho = configurar(Compass);
export const IcChecagem = configurar(Check);
export const IcPrazo = configurar(CalendarClock);
export const IcAcessos = configurar(KeyRound);
export const IcInvestimento = configurar(Banknote);
