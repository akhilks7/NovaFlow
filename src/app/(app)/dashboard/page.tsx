import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import LineChart from "@/components/ui/LineChart";
import BarChart from "@/components/ui/BarChart";

export const metadata: Metadata = {
  title: "Dashboard",
};

const stats = [
  { label: "Active workflows", value: "24", delta: "+3", up: true, spark: [3, 5, 4, 6, 7, 6, 9] },
  { label: "Executions (7d)", value: "1,284", delta: "+12.4%", up: true, spark: [12, 18, 10, 22, 19, 27, 24] },
  { label: "Success rate", value: "98.2%", delta: "+0.4%", up: true, spark: [4, 5, 5, 6, 5, 6, 6] },
  { label: "Failed runs", value: "23", delta: "-18%", up: true, spark: [8, 6, 7, 4, 5, 3, 2] },
];

const executions = [
  { label: "Jan", value: 320 },
  { label: "Feb", value: 410 },
  { label: "Mar", value: 380 },
  { label: "Apr", value: 540 },
  { label: "May", value: 610 },
  { label: "Jun", value: 580 },
  { label: "Jul", value: 720 },
  { label: "Aug", value: 790 },
  { label: "Sep", value: 870 },
  { label: "Oct", value: 820 },
  { label: "Nov", value: 960 },
  { label: "Dec", value: 1024 },
];

const topWorkflows = [
  { name: "Invoice reminder", runs: "1,204", pct: 92 },
  { name: "Lead capture sync", runs: "342", pct: 78 },
  { name: "Daily report digest", runs: "128", pct: 54 },
  { name: "New user onboarding", runs: "89", pct: 41 },
];

const activity = [
  {
    workflow: "Invoice reminder",
    trigger: "Scheduled — daily 09:00",
    runs: "1,204",
    status: "success",
    tone: "success" as const,
  },
  {
    workflow: "Lead capture sync",
    trigger: "Webhook",
    runs: "342",
    status: "success",
    tone: "success" as const,
  },
  {
    workflow: "Daily report digest",
    trigger: "Scheduled — 18:00",
    runs: "128",
    status: "failed",
    tone: "danger" as const,
  },
  {
    workflow: "New user onboarding",
    trigger: "Form submit",
    runs: "89",
    status: "running",
    tone: "accent" as const,
  },
];

export default function DashboardPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Overview</h1>
          <p>Here&apos;s what&apos;s happening across your workflows today.</p>
        </div>
        <Badge tone="neutral">Demo data</Badge>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="stat-label">
              {stat.label}
              <Badge tone={stat.up ? "success" : "danger"}>
                {stat.up ? "▲" : "▼"} {stat.delta}
              </Badge>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-trend">vs last period</div>
            <div className="stat-spark">
              <BarChart data={stat.spark.map((value, i) => ({ label: `d${i}`, value }))} height={40} />
            </div>
          </Card>
        ))}
      </div>

      <div className="dash-grid">
        <Card title="Executions" subtitle="Monthly automated runs">
          <LineChart data={executions} />
        </Card>

        <Card title="Top workflows" subtitle="By total runs">
          <div className="progress-list">
            {topWorkflows.map((workflow) => (
              <div key={workflow.name} className="progress-item">
                <div className="row">
                  <span>{workflow.name}</span>
                  <span className="runs">{workflow.runs} runs</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${workflow.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="full">
          <Card title="Recent activity" subtitle="Latest runs across all workflows">
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Workflow</th>
                    <th>Trigger</th>
                    <th>Runs</th>
                    <th>Owner</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((row) => (
                    <tr key={row.workflow}>
                      <td>
                        <div className="cell-user">
                          <Avatar name={row.workflow} size="sm" />
                          <div className="meta">
                            <span>{row.workflow}</span>
                            <span className="sub">Last run 12 min ago</span>
                          </div>
                        </div>
                      </td>
                      <td className="muted">{row.trigger}</td>
                      <td className="muted">{row.runs}</td>
                      <td>
                        <div className="cell-user">
                          <Avatar name="Akhil K S" size="sm" />
                          <span>Akhil</span>
                        </div>
                      </td>
                      <td>
                        <Badge tone={row.tone}>{row.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}