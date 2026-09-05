import type { ReactNode } from "react";

/**
 * Inline stroke icons on a 24px grid. Hand-authored rather than pulled from a
 * package so nothing ships that the app does not render.
 */

export type IconProps = {
  size?: number;
  className?: string;
};

function Glyph({
  size = 20,
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function LogoMark({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2.5 14.1 8.6 20.5 10.7 14.1 12.8 12 19.5 9.9 12.8 3.5 10.7 9.9 8.6 12 2.5Z" />
      <circle cx="18.8" cy="18.4" r="2.1" opacity="0.75" />
    </svg>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="3" y="3" width="7.5" height="8" rx="1.8" />
      <rect x="13.5" y="3" width="7.5" height="5" rx="1.8" />
      <rect x="13.5" y="11" width="7.5" height="10" rx="1.8" />
      <rect x="3" y="14" width="7.5" height="7" rx="1.8" />
    </Glyph>
  );
}

export function FlowIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="5" cy="6" r="2.5" />
      <circle cx="19" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M7.5 6h9" />
      <path d="m6.3 8.2 4.2 7.6" />
      <path d="m17.7 8.2-4.2 7.6" />
    </Glyph>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20.5a8 8 0 0 1 16 0" />
    </Glyph>
  );
}

export function TeamIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="9" cy="8" r="3.6" />
      <path d="M2.5 20.5a6.5 6.5 0 0 1 13 0" />
      <path d="M16.4 4.8a3.6 3.6 0 0 1 0 6.6" />
      <path d="M18 14.6a6.5 6.5 0 0 1 3.5 5.9" />
    </Glyph>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M4 6h9" />
      <path d="M18 6h2" />
      <circle cx="15.5" cy="6" r="2.2" />
      <path d="M4 12h2" />
      <path d="M11 12h9" />
      <circle cx="8.5" cy="12" r="2.2" />
      <path d="M4 18h7" />
      <path d="M16 18h4" />
      <circle cx="13.5" cy="18" r="2.2" />
    </Glyph>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 21.5s7.5-3.8 7.5-9.5V5.4L12 2.5 4.5 5.4v6.6c0 5.7 7.5 9.5 7.5 9.5Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </Glyph>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2" />
      <path d="M12 19.5v2" />
      <path d="M2.5 12h2" />
      <path d="M19.5 12h2" />
      <path d="m5.3 5.3 1.4 1.4" />
      <path d="m17.3 17.3 1.4 1.4" />
      <path d="m18.7 5.3-1.4 1.4" />
      <path d="m6.7 17.3-1.4 1.4" />
    </Glyph>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M20.8 13.4A9 9 0 1 1 10.6 3.2a7 7 0 0 0 10.2 10.2Z" />
    </Glyph>
  );
}

export function SystemIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
      <path d="M9 20.5h6" />
      <path d="M12 16.5v4" />
    </Glyph>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </Glyph>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </Glyph>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Glyph>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M12 3.5H5.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V12" />
      <path d="M18.4 2.6a2 2 0 0 1 3 3L12 15l-4 1 1-4Z" />
    </Glyph>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M3.5 6h17" />
      <path d="M9 6V4.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4.5V6" />
      <path d="M18.5 6 17.6 19a2 2 0 0 1-2 1.9H8.4a2 2 0 0 1-2-1.9L5.5 6" />
      <path d="M10.5 10.5v6" />
      <path d="M13.5 10.5v6" />
    </Glyph>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </Glyph>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </Glyph>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Glyph>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.2 12.3 2.6 2.6 5-5.8" />
    </Glyph>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M10.3 3.9 2.5 17.4a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9.5v4" />
      <path d="M12 17h.01" />
    </Glyph>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 7.8h.01" />
    </Glyph>
  );
}

export function SignOutIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M9.5 20.5H5.5a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2h4" />
      <path d="M15.5 16.5 20 12l-4.5-4.5" />
      <path d="M20 12H9" />
    </Glyph>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m16.2 7.8-2.4 6.6-6.6 2.4 2.4-6.6 6.6-2.4Z" />
    </Glyph>
  );
}

export function RetryIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.5-6" />
      <path d="M20.5 3.5V9h-5.5" />
    </Glyph>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M13.2 2.5 3.8 13.8h7.3l-1.3 7.7 9.4-11.3h-7.3l1.3-7.7Z" />
    </Glyph>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M14.6 4H9.4L8 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3l-1.4-2Z" />
      <circle cx="12" cy="13" r="3.5" />
    </Glyph>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.2" />
      <path d="m3 7 7.9 5.3a2 2 0 0 0 2.2 0L21 7" />
    </Glyph>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="4" y="10" width="16" height="10.5" rx="2.2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </Glyph>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.2 2" />
    </Glyph>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20.5 20.5-4.5-4.5" />
    </Glyph>
  );
}

export function WebhookIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M8.4 10.2a4 4 0 1 1 5.4 3.7" />
      <path d="m9.6 12.6-3 5.2" />
      <path d="M6.6 17.8h10.8" />
      <path d="m13.8 13.9 2.9 5" />
    </Glyph>
  );
}
