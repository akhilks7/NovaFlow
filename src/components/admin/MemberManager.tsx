"use client";

import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  EditIcon,
  InfoIcon,
  PlusIcon,
  SearchIcon,
  TeamIcon,
  TrashIcon,
} from "@/components/ui/icons";
import { CreateMemberDialog } from "@/components/admin/CreateMemberDialog";
import { EditMemberDialog } from "@/components/admin/EditMemberDialog";
import { deleteMember } from "@/utils/admin/actions";
import { formatDate, titleCase } from "@/utils/format";
import type { AccountStatus, Profile } from "@/utils/types";

const ROLE_FILTERS = [
  { value: "all", label: "Everyone" },
  { value: "admin", label: "Admins" },
  { value: "member", label: "Members" },
] as const;

type RoleFilter = (typeof ROLE_FILTERS)[number]["value"];

const STATUS_BADGE: Record<AccountStatus, string> = {
  active: "badge badge--positive",
  invited: "badge badge--info",
  suspended: "badge badge--critical",
};

type DialogState =
  | { mode: "create" }
  | { mode: "edit"; member: Profile }
  | { mode: "delete"; member: Profile }
  | null;

type MemberManagerProps = {
  members: Profile[];
  currentUserId: string;
  /** False when SUPABASE_SERVICE_ROLE_KEY is not configured. */
  canManageAccounts: boolean;
};

export function MemberManager({
  members,
  currentUserId,
  canManageAccounts,
}: MemberManagerProps) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [dialog, setDialog] = useState<DialogState>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return members.filter((member) => {
      if (roleFilter !== "all" && member.role !== roleFilter) return false;
      if (needle === "") return true;

      return (
        member.email.toLowerCase().includes(needle) ||
        (member.full_name ?? "").toLowerCase().includes(needle)
      );
    });
  }, [members, query, roleFilter]);

  return (
    <div className="stack stack--lg">
      <header className="page-header">
        <div className="page-header__text">
          <p className="eyebrow">Administration</p>
          <h1 className="title-1">Members</h1>
          <p className="muted">
            {members.length} {members.length === 1 ? "account" : "accounts"} in this
            workspace.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setDialog({ mode: "create" })}
          disabled={!canManageAccounts}
          title={
            canManageAccounts ? undefined : "SUPABASE_SERVICE_ROLE_KEY is not configured"
          }
        >
          <PlusIcon size={17} className="btn__icon" />
          Add member
        </button>
      </header>

      {!canManageAccounts ? (
        <p className="notice notice--info">
          <InfoIcon size={17} />
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to <code>.env.local</code> to create
          and delete accounts. Roles and statuses can still be changed without it.
        </p>
      ) : null}

      <div className="cluster cluster--between">
        <div className="field grow" style={{ maxWidth: "320px" }}>
          <label className="visually-hidden" htmlFor="member-search">
            Search members
          </label>
          <div className="input-icon">
            <SearchIcon size={17} />
            <input
              id="member-search"
              type="search"
              className="input"
              placeholder="Search by name or email"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="segmented" role="radiogroup" aria-label="Filter by role">
          {ROLE_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={roleFilter === option.value}
              className="segmented__option"
              onClick={() => setRoleFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <section className="card card--flush glass">
        {visible.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">
              <TeamIcon size={24} />
            </span>
            <p className="title-3">No matching members</p>
            <p className="muted">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Member</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                  <th scope="col">Joined</th>
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((member) => {
                  const isSelf = member.id === currentUserId;
                  const deletable = canManageAccounts && !isSelf && member.role !== "admin";

                  return (
                    <tr key={member.id}>
                      <td>
                        <span className="table__cell-label">Member</span>
                        <span className="person">
                          <Avatar
                            name={member.full_name}
                            email={member.email}
                            src={member.avatar_url}
                            size={36}
                          />
                          <span className="person__text">
                            <span className="person__name">
                              {member.full_name ?? "Unnamed"}
                              {isSelf ? <span className="badge"> You</span> : null}
                            </span>
                            <span className="person__meta">{member.email}</span>
                          </span>
                        </span>
                      </td>
                      <td>
                        <span className="table__cell-label">Role</span>
                        <span
                          className={
                            member.role === "admin" ? "badge badge--brand" : "badge"
                          }
                        >
                          {titleCase(member.role)}
                        </span>
                      </td>
                      <td>
                        <span className="table__cell-label">Status</span>
                        <span className={STATUS_BADGE[member.status]}>
                          <span className="badge__dot" />
                          {titleCase(member.status)}
                        </span>
                      </td>
                      <td>
                        <span className="table__cell-label">Joined</span>
                        <time className="secondary" dateTime={member.created_at}>
                          {formatDate(member.created_at)}
                        </time>
                      </td>
                      <td>
                        <div className="table__actions">
                          <button
                            type="button"
                            className="btn btn--subtle btn--sm"
                            onClick={() => setDialog({ mode: "edit", member })}
                          >
                            <EditIcon size={15} />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn--ghost btn--icon"
                            onClick={() => setDialog({ mode: "delete", member })}
                            disabled={!deletable}
                            aria-label={`Delete ${member.full_name ?? member.email}`}
                            title={
                              isSelf
                                ? "You cannot delete your own account"
                                : member.role === "admin"
                                  ? "Change this person to a member first"
                                  : !canManageAccounts
                                    ? "SUPABASE_SERVICE_ROLE_KEY is not configured"
                                    : undefined
                            }
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {dialog?.mode === "create" ? (
        <CreateMemberDialog onClose={() => setDialog(null)} />
      ) : null}

      {dialog?.mode === "edit" ? (
        <EditMemberDialog
          member={dialog.member}
          isSelf={dialog.member.id === currentUserId}
          onClose={() => setDialog(null)}
        />
      ) : null}

      {dialog?.mode === "delete" ? (
        <ConfirmDialog
          title="Delete account"
          description={`${dialog.member.full_name ?? dialog.member.email} will lose access immediately, along with everything they own. This cannot be undone.`}
          confirmLabel="Delete account"
          action={deleteMember}
          fields={{ id: dialog.member.id }}
          onClose={() => setDialog(null)}
        />
      ) : null}
    </div>
  );
}
