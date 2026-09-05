import { createClient } from "@/utils/supabase/server";
import type { ActivityEntry, WorkflowStatus } from "@/utils/types";

type WorkflowTotals = Record<WorkflowStatus, number> & { all: number };

export type ActivityDay = {
  /** `YYYY-MM-DD` in UTC. */
  date: string;
  count: number;
};

type TeamTotals = {
  members: number;
  admins: number;
  active: number;
  suspended: number;
};

const ACTIVITY_WINDOW_DAYS = 14;
/** Enough rows to draw a fortnight of activity without an unbounded scan. */
const ACTIVITY_ROW_LIMIT = 500;

/** One query, counted in memory — cheaper than four `head: true` round trips. */
export async function getWorkflowTotals(): Promise<WorkflowTotals> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("workflows").select("status");

  if (error) throw new Error(`Could not load workflow totals: ${error.message}`);

  const totals: WorkflowTotals = {
    all: 0,
    draft: 0,
    active: 0,
    paused: 0,
    archived: 0,
  };

  for (const row of data ?? []) {
    totals.all += 1;
    totals[row.status as WorkflowStatus] += 1;
  }

  return totals;
}

/**
 * Recent activity, used for both the feed and the fortnight chart so the page
 * only pays for one round trip.
 */
export async function getRecentActivity(): Promise<{
  entries: ActivityEntry[];
  series: ActivityDay[];
}> {
  const supabase = await createClient();

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - (ACTIVITY_WINDOW_DAYS - 1));
  since.setUTCHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false })
    .limit(ACTIVITY_ROW_LIMIT);

  if (error) throw new Error(`Could not load activity: ${error.message}`);

  const entries = (data ?? []) as ActivityEntry[];

  const buckets = new Map<string, number>();
  for (let offset = 0; offset < ACTIVITY_WINDOW_DAYS; offset += 1) {
    const day = new Date(since);
    day.setUTCDate(since.getUTCDate() + offset);
    buckets.set(day.toISOString().slice(0, 10), 0);
  }

  for (const entry of entries) {
    const key = entry.created_at.slice(0, 10);
    const current = buckets.get(key);
    if (current !== undefined) buckets.set(key, current + 1);
  }

  return {
    entries,
    series: [...buckets].map(([date, count]) => ({ date, count })),
  };
}

/** Directory totals. Only admins can read past their own row, so this is theirs. */
export async function getTeamTotals(): Promise<TeamTotals> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("profiles").select("role, status");

  if (error) throw new Error(`Could not load team totals: ${error.message}`);

  const totals: TeamTotals = { members: 0, admins: 0, active: 0, suspended: 0 };

  for (const row of data ?? []) {
    if (row.role === "admin") totals.admins += 1;
    else totals.members += 1;
    if (row.status === "active") totals.active += 1;
    if (row.status === "suspended") totals.suspended += 1;
  }

  return totals;
}
