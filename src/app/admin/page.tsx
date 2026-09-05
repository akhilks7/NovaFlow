import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import LineChart from "@/components/ui/LineChart";
import BarChart from "@/components/ui/BarChart";

export const metadata: Metadata = {
  title: "Platform Overview",
};

const health = [
  { label: "API Gateway", status: "Operational", tone: "ok" },
  { label: "Background workers", status: "Operational", tone: "ok" },
  { label: "Webhooks", status: "Degraded", tone: "warn" },
];

const kpis = [
  { label: "Workspaces", value: "48", delta: "+2", up: true, spark: [4, 5, 6, 5, 7, 6, 8] },
  { label: "Monthly recurring revenue", value: "$12,480", delta: "+4.1%", up: true, spark: [8, 9, 9, 10, 10, 11, 12] },
  { label: "Active seats", value: "142", delta: "+9", up: true, spark: [12, 13, 15, 14, 16, 17, 19] },
  { label: "Executions / month", value: "184k", delta: "+22%", up: true, spark: [10, 12, 14, 13, 17, 19, 22] },
];

const executions = [
  { label: "Jan", value: 96 },
  { label: "Feb", value: 108 },
  { label: "Mar", value: 121 },
  { label: "Apr", value: 132 },
  { label: "May", value: 128 },
  { label: "Jun", value: 149 },
  { label: "Jul", value: 155 },
  { label: "Aug", value: 164 },
  { label: "Sep", value: 171 },
  { label: "Oct", value: 179 },
  { label: "Nov", value: 182 },
  { label: "Dec", value: 184 },
];

const storage = [
  { workspace: "Acme Corp", used: "2.1 TB", pct: 84 },
  { workspace: "Northwind Labs", used: "840 GB", pct: 62 },
  { workspace: "Globex", used: "420 GB", pct: 45 },
  { workspace: "Stark Systems", used: "180 GB", pct: 22 },
];

const signups = [
  {
    workspace: "Acme Corp",
    owner: "Priya Nair",
    plan: "Business",
    created: "Sep 02",
    tone: "accent" as const,
    status: "active",
  },
  {
    workspace: "Northwind Labs",
    owner: "Daniel Tan",
    plan: "Pro",
    created: "Aug 28",
    tone: "neutral" as const,
    status: "active",
  },
  {
    workspace: "Globex",
    owner: "Sofia Mendes",
    plan: "Trial",
    created: "Aug 22",
    tone: "warning" as const,
    status: "trial",
  },
  {
    workspace: "Stark Systems",
    owner: "Marcus Lee",
    plan: "Business",
    created: "Aug 18",
    tone: "danger" as const,
    status: "locked",
  },
];

export default function AdminOverviewPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Platform overview</h1>
          <p>Live usage and health across every NovaFlow workspace.</p>
        </div>
        <Badge tone="success">All systems operational</Badge>
      </div>

      <div className="admin-health">
        {health.map((item) => (
          <Card key={item.label}>
            <div className="health-row">
              <span>{item.label}</span>
              <span className="health-right">
                <span className={`status-dot ${item.tone}`} />
                {item.status}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="stats-grid">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <div className="stat-label">
              {kpi.label}
              <Badge tone={kpi.up ? "success" : "danger"}>
                {kpi.up ? "▲" : "▼"} {kpi.delta}
              </Badge>
            </div>
            <div className="stat-value">{kpi.value}</div>
            <div className="stat-trend">vs last period</div>
            <div className="stat-spark">
              <BarChart data={kpi.spark.map((value, i) => ({ label: `d${i}`, value }))} height={40} />
            </div>
          </Card>
        ))}
      </div>

      <div className="admin-duo">
        <Card title="Platform executions" subtitle="Millions of runs across all workspaces">
          <LineChart data={executions} />
        </Card>

        <Card title="Storage by top workspaces">
          <div className="progress-list">
            {storage.map((item) => (
              <div key={item.workspace} className="progress-item">
                <div className="row">
                  <span>{item.workspace}</span>
                  <span className="runs">{item.used}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Recent signups" subtitle="Newest workspaces on the platform">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Workspace</th>
                <th>Owner</th>
                <th>Plan</th>
                <th>Created</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {signups.map((row) => (
                <tr key={row.workspace}>
                  <td>
                    <div className="cell-user">
                      <Avatar name={row.workspace} size="sm" />
                      <span>{row.workspace}</span>
                    </div>
                  </td>
                  <td>
                    <div className="cell-user">
                      <Avatar name={row.owner} size="sm" />
                      <span>{row.owner}</span>
                    </div>
                  </td>
                  <td className="muted">{row.plan}</td>
                  <td className="muted">{row.created}</td>
                  <td>
                    <Badge tone={row.tone}>{row.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}