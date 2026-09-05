import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export default function Card({ title, subtitle, children, className = "" }: CardProps) {
  return (
    <section className={`card ${className}`.trim()}>
      {title && (
        <div className="card-header">
          <div>
            <h3 className="card-title">{title}</h3>
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}