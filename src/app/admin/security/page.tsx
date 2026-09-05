import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";

export const metadata: Metadata = {
  title: "Security",
};

const policies = [
  {
    id: "sso",
    title: "SSO enforced",
    description: "All workspaces must use SAML or OIDC for login.",
    on: true,
  },
  {
    id: "2fa",
    title: "Two-factor required",
    description: "Every admin must enroll a second factor.",
    on: true,
  },
  {
    id: "ip",
    title: "IP allowlist",
    description: "Restrict console access to trusted networks.",
    on: false,
  },
  {
    id: "timeout",
    title: "Session timeout",
    description: "Auto-expire idle sessions after 30 minutes.",
    on: true,
  },
];

const audit = [
  {
    actor: "Akhil K S",
    action: "update.workspace",
    resource: "Acme Corp",
    ip: "203.0.113.42",
    time: "2 min ago",
    tone: "success" as const,
    outcome: "allowed",
  },
  {
    actor: "System",
    action: "login.sso",
    resource: "Northwind Labs",
    ip: "198.51.100.7",
    time: "18 min ago",
    tone: "success" as const,
    outcome: "allowed",
  },
  {
    actor: "Sofia Mendes",
    action: "invite.user",
    resource: "Globex",
    ip: "192.0.2.91",
    time: "1 hr ago",
    tone: "danger" as const,
    outcome: "blocked",
  },
  {
    actor: "Marcus Lee",
    action: "delete.workflow",
    resource: "Stark Systems",
    ip: "203.0.113.118",
    time: "3 hrs ago",
    tone: "success" as const,
    outcome: "allowed",
  },
];

export default function AdminSecurityPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Security</h1>
          <p>Platform-wide policies and the audit trail.</p>
        </div>
      </div>

      <div className="admin-duo">
        <Card title="Platform policies" subtitle="Applied to every workspace">
          {policies.map((policy) => (
            <div className="toggle-row" key={policy.id}>
              <div className="t-toggle-meta">
                <div className="t-title">{policy.title}</div>
                <div className="t-desc">{policy.description}</div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked={policy.on} />
                <span className="track" />
                <span className="thumb" />
              </label>
            </div>
          ))}
        </Card>

        <Card title="Security events" subtitle="Last 7 days">
          <div className="progress-list">
            {[
              { label: "SSO logins", value: "1,204", pct: 92 },
              { label: "Blocked attempts", value: "37", pct: 24 },
              { label: "Password resets", value: "18", pct: 14 },
            ].map((item) => (
              <div key={item.label} className="progress-item">
                <div className="row">
                  <span>{item.label}</span>
                  <span className="runs">{item.value}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Audit log" subtitle="Authenticated admin actions">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Actor</th>
                <th>Action</th>
                <th>Resource</th>
                <th>IP</th>
                <th>Time</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {audit.map((row) => (
                <tr key={`${row.actor}-${row.time}`}>
                  <td>
                    <div className="cell-user">
                      <Avatar name={row.actor} size="sm" />
                      <span>{row.actor}</span>
                    </div>
                  </td>
                  <td className="muted">{row.action}</td>
                  <td>{row.resource}</td>
                  <td className="muted">{row.ip}</td>
                  <td className="muted">{row.time}</td>
                  <td>
                    <Badge tone={row.tone}>{row.outcome}</Badge>
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