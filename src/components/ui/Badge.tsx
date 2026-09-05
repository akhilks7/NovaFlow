import type { ReactNode } from "react";

type Tone = "success" | "danger" | "warning" | "accent" | "neutral";

const tones: Record<Tone, string> = {
  success: "badge-success",
  danger: "badge-danger",
  warning: "badge-warning",
  accent: "badge-accent",
  neutral: "badge-neutral",
};

export default function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`badge ${tones[tone]}`}>{children}</span>;
}