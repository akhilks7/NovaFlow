import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";

export const metadata: Metadata = {
  title: "Workspaces",
};

const workspaces = [
  {
    name: "Acme Corp",
    owner: "Priya Nair",
    plan: "Business",
    seats: "18 / 20",
    executions: "48k",
    tone: "success" as const,
    status: "active",
  },
  {
    name: "Northwind Labs",
    owner: "Daniel Tan",
    plan: "Pro",
    seats: "9 / 12",
    executions: "22k",
    tone: "success" as const,
    status: "active",
  },
  {
    name: "Globex",
    owner: "Sofia Mendes",
    plan: "Trial",
    seats: "3 / 5",
    executions: "1.2k",
    tone: "warning" as const,
    status: "trial",
  },
  {
    name: "Stark Systems",
    owner: "Marcus Lee",
    plan: "Business",
    seats: "14 / 20",
    executions: "31k",
    tone: "danger" as const,
    status: "locked",
  },
];

export default function AdminWorkspacesPage() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Workspaces</h1>
          <p>Every workspace on the platform and its current plan.</p>
        </div>
        <Button href="/admin/workspaces" variant="ghost" size="sm">
          + Create workspace
        </Button>
      </div>

      <Card>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Workspace</th>
                <th>Plan</th>
                <th>Seats</th>
                <th>Executions</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {workspaces.map((row) => (
                <tr key={row.name}>
                  <td>
                    <div className="cell-user">
                      <Avatar name={row.name} size="sm" />
                      <div className="meta">
                        <span>{row.name}</span>
                        <span className="sub">{row.owner}</span>
                      </div>
                    </div>
                  </td>
                  <td className="muted">{row.plan}</td>
                  <td className="muted">{row.seats}</td>
                  <td className="muted">{row.executions}</td>
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