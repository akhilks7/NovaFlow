import type { Metadata } from "next";
import Link from "next/link";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { StatTile } from "@/components/dashboard/StatTile";
import {
  ArrowRightIcon,
  BoltIcon,
  ClockIcon,
  FlowIcon,
  ShieldIcon,
  TeamIcon,
} from "@/components/ui/icons";
import { isAdmin, requireProfile } from "@/utils/auth/dal";
import {
  getRecentActivity,
  getTeamTotals,
  getWorkflowTotals,
} from "@/utils/dashboard/queries";

export const metadata: Metadata = {
  title: "Dashboard",
};

const FEED_LENGTH = 7;

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const profile = await requireProfile();
  const admin = isAdmin(profile);

  // Independent reads, so they overlap rather than waterfall.
  const [totals, activity, team] = await Promise.all([
    getWorkflowTotals(),
    getRecentActivity(),
    admin ? getTeamTotals() : Promise.resolve(null),
  ]);

  const firstName = profile.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="stack stack--lg rise">
      <header className="page-header">
        <div className="page-header__text">
          <p className="eyebrow">{greeting()}</p>
          <h1 className="title-1">{firstName}, here is your workspace</h1>
        </div>
        <div className="cluster">
          <span className={admin ? "badge badge--brand" : "badge"}>
            {admin ? <ShieldIcon size={13} /> : null}
            {admin ? "Administrator" : "Member"}
          </span>
          <Link href="/workflows" className="btn btn--primary">
            Open workflows
            <ArrowRightIcon size={17} className="btn__icon" />
          </Link>
        </div>
      </header>

      <section className="grid grid--stats" aria-label="Overview">
        <StatTile
          label={admin ? "Workflows (all)" : "Your workflows"}
          value={totals.all}
          icon={<FlowIcon size={18} />}
          hint={`${totals.draft} in draft`}
        />
        <StatTile
          label="Running"
          value={totals.active}
          icon={<BoltIcon size={18} />}
          hint={totals.all > 0 ? `${Math.round((totals.active / totals.all) * 100)}% of total` : "Nothing running yet"}
        />
        <StatTile
          label="Paused"
          value={totals.paused}
          icon={<ClockIcon size={18} />}
          hint={`${totals.archived} archived`}
        />
        {team ? (
          <StatTile
            label="Team members"
            value={team.admins + team.members}
            icon={<TeamIcon size={18} />}
            hint={`${team.admins} admin${team.admins === 1 ? "" : "s"} · ${team.suspended} suspended`}
          />
        ) : (
          <StatTile
            label="Recent events"
            value={activity.entries.length}
            icon={<BoltIcon size={18} />}
            hint="Last 14 days"
          />
        )}
      </section>

      <div className="split">
        <section className="card glass">
          <div className="card__header">
            <div className="card__title">
              <h2 className="title-2">Activity</h2>
              <p className="muted">Events recorded over the last fortnight.</p>
            </div>
          </div>
          <ActivityChart series={activity.series} />
        </section>

        <section className="card glass">
          <div className="card__header">
            <div className="card__title">
              <h2 className="title-2">Latest</h2>
              <p className="muted">
                {admin ? "Everything across the workspace." : "Changes you have made."}
              </p>
            </div>
          </div>
          <ActivityFeed entries={activity.entries.slice(0, FEED_LENGTH)} />
        </section>
      </div>

      {admin && team ? (
        <section className="card glass">
          <div className="card__header">
            <div className="card__title">
              <h2 className="title-2">Directory health</h2>
              <p className="muted">
                {team.active} of {team.admins + team.members} accounts are active.
              </p>
            </div>
            <Link href="/admin/users" className="btn btn--glass btn--sm">
              Manage members
              <ArrowRightIcon size={15} className="btn__icon" />
            </Link>
          </div>
          <div
            className="meter"
            role="meter"
            aria-valuenow={team.active}
            aria-valuemin={0}
            aria-valuemax={team.admins + team.members}
            aria-label="Active accounts"
          >
            <div
              className="meter__fill"
              style={{
                width: `${((team.active / Math.max(1, team.admins + team.members)) * 100).toFixed(1)}%`,
              }}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
