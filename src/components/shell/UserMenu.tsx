"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import {
  ChevronDownIcon,
  SettingsIcon,
  SignOutIcon,
  UserIcon,
} from "@/components/ui/icons";
import { signout } from "@/utils/auth/actions";
import { titleCase } from "@/utils/format";
import type { Profile } from "@/utils/types";

export function UserMenu({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!anchorRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="menu-anchor" ref={anchorRef}>
      <button
        type="button"
        className="btn btn--ghost"
        style={{ paddingInline: "0.4rem" }}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Avatar
          name={profile.full_name}
          email={profile.email}
          src={profile.avatar_url}
          size={30}
        />
        <ChevronDownIcon size={15} />
        <span className="visually-hidden">Account menu</span>
      </button>

      {open ? (
        <div className="menu glass" role="menu">
          <div className="menu__header">
            <Avatar
              name={profile.full_name}
              email={profile.email}
              src={profile.avatar_url}
              size={38}
            />
            <span className="person__text">
              <span className="person__name">{profile.full_name ?? "Unnamed"}</span>
              <span className="person__meta">{profile.email}</span>
            </span>
          </div>

          <div className="cluster" style={{ padding: "0 0.55rem 0.55rem" }}>
            <span className={profile.role === "admin" ? "badge badge--brand" : "badge"}>
              {titleCase(profile.role)}
            </span>
          </div>

          <hr className="divider" />

          <Link
            href="/profile"
            className="menu__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <UserIcon size={17} />
            Your profile
          </Link>
          <Link
            href="/settings"
            className="menu__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <SettingsIcon size={17} />
            Settings
          </Link>

          <hr className="divider" />

          <form action={signout}>
            <button type="submit" className="menu__item menu__item--danger" role="menuitem">
              <SignOutIcon size={17} />
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
