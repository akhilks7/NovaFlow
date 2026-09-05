import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Notifications",
};

const toggles = [
  {
    id: "digest",
    title: "Daily digest",
    description: "A summary of executions and errors each morning.",
    on: true,
  },
  {
    id: "weekly",
    title: "Weekly report",
    description: "Long-form metrics for the past week.",
    on: false,
  },
  {
    id: "alerts",
    title: "Error alerts",
    description: "Instant notification when a workflow fails.",
    on: true,
  },
  {
    id: "security",
    title: "Security notices",
    description: "Login attempts and access changes.",
    on: true,
  },
];

export default function NotificationSettingsPage() {
  return (
    <Card title="Notification preferences">
      {toggles.map((toggle) => (
        <div className="toggle-row" key={toggle.id}>
          <div className="t-toggle-meta">
            <div className="t-title">{toggle.title}</div>
            <div className="t-desc">{toggle.description}</div>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked={toggle.on} />
            <span className="track" />
            <span className="thumb" />
          </label>
        </div>
      ))}
      <div className="card-actions">
        <Button size="sm">Save preferences</Button>
      </div>
    </Card>
  );
}