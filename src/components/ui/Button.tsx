import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  block?: boolean;
  className?: string;
  children: ReactNode;
};

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

const sizes = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

export default function Button({
  href,
  variant = "primary",
  size = "md",
  block = false,
  className = "",
  children,
}: ButtonProps) {
  const cls = ["btn", variants[variant], sizes[size], block ? "btn-block" : "", className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link className={cls} href={href}>
        {children}
      </Link>
    );
  }

  return <button className={cls}>{children}</button>;
}