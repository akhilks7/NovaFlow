import type { SVGProps } from "react";

function Stroke({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </Stroke>
  );
}

export function BuilderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
    </Stroke>
  );
}

export function PulseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <path d="M2 12h4l3-8 4 16 3-8h6" />
    </Stroke>
  );
}

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Stroke>
  );
}

export function GridIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </Stroke>
  );
}

export function GearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
    </Stroke>
  );
}

export function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </Stroke>
  );
}

export function ZapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
    </Stroke>
  );
}

export function BranchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <path d="M6 8.5v3a5 5 0 0 0 5 5h4.5" />
    </Stroke>
  );
}

export function BuildingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Stroke {...props}>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M9 7h2M9 11h2M9 15h2M13 7h2M13 11h2M13 15h2M8 21v-3h8v3" />
    </Stroke>
  );
}