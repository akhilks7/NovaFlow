import Image from "next/image";
import type { CSSProperties } from "react";
import { avatarGradient, initials } from "@/utils/format";

type AvatarProps = {
  name: string | null;
  email: string;
  src?: string | null;
  size?: number;
  className?: string;
};

/**
 * Photo when there is one, otherwise initials on a gradient derived from the
 * email — so every account has a stable, distinguishable mark with no network
 * request and no placeholder asset.
 */
export function Avatar({ name, email, src, size = 40, className }: AvatarProps) {
  const { from, to } = avatarGradient(email);

  const style = {
    "--avatar-size": `${size}px`,
    "--avatar-from": from,
    "--avatar-to": to,
  } as CSSProperties;

  return (
    <span className={className ? `avatar ${className}` : "avatar"} style={style}>
      {src ? (
        <Image src={src} alt="" width={size} height={size} />
      ) : (
        initials(name, email)
      )}
    </span>
  );
}
