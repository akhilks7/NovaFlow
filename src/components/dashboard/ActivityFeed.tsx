import {
  BoltIcon,
  EditIcon,
  PlusIcon,
  ShieldIcon,
  TeamIcon,
  TrashIcon,
  type IconProps,
} from "@/components/ui/icons";
import { relativeTime } from "@/utils/format";
import type { ActivityEntry } from "@/utils/types";

const PRESENTATION: Record<
  ActivityEntry["action"],
  { Icon: (props: IconProps) => React.ReactElement; verb: string }
> = {
  created: { Icon: PlusIcon, verb: "Created" },
  updated: { Icon: EditIcon, verb: "Updated" },
  deleted: { Icon: TrashIcon, verb: "Deleted" },
  joined: { Icon: TeamIcon, verb: "Joined" },
  role_changed: { Icon: ShieldIcon, verb: "Role changed" },
  status_changed: { Icon: ShieldIcon, verb: "Status changed" },
};

function describe(entry: ActivityEntry): string {
  const { verb } = PRESENTATION[entry.action];
  const label = entry.entity_label ?? "an item";

  if (entry.action === "joined") return `${label} joined the workspace`;
  if (entry.action === "role_changed" || entry.action === "status_changed") {
    return `${verb} — ${label}`;
  }

  return `${verb} ${entry.entity} “${label}”`;
}

export function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon">
          <BoltIcon size={24} />
        </span>
        <p className="title-3">No activity yet</p>
        <p className="muted">Anything you create or change shows up here.</p>
      </div>
    );
  }

  return (
    <ul className="feed">
      {entries.map((entry) => {
        const { Icon } = PRESENTATION[entry.action];

        return (
          <li key={entry.id} className="feed__item">
            <span className="feed__marker">
              <Icon size={15} />
            </span>
            <div className="feed__body">
              <p className="feed__text">{describe(entry)}</p>
              <time className="feed__time" dateTime={entry.created_at}>
                {relativeTime(entry.created_at)}
              </time>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
