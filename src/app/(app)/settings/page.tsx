import type { Metadata } from "next";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfileSettingsPage() {
  return (
    <div className="settings-grid">
      <Card title="Workspace">
        <dl className="kv">
          <div>
            <dt>Name</dt>
            <dd>NovaFlow</dd>
          </div>
          <div>
            <dt>Plan</dt>
            <dd>
              <Badge tone="accent">Pro</Badge>
            </dd>
          </div>
          <div>
            <dt>Members</dt>
            <dd>4</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>Jan 2026</dd>
          </div>
        </dl>
      </Card>

      <Card title="Profile">
        <div className="edit-card">
          <div className="edit-avatar">
            <Avatar name="Akhil K S" size="lg" />
          </div>
          <div>
            <p className="t-desc">
              Your avatar and details are shown across NovaFlow. Demo build — no upload.
            </p>
            <Button href="/settings" variant="ghost" size="sm">
              Choose file
            </Button>
          </div>
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="first">First name</label>
            <input id="first" defaultValue="Akhil" />
          </div>
          <div className="field">
            <label htmlFor="last">Last name</label>
            <input id="last" defaultValue="K S" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" defaultValue="akhil@novaf.io" />
          </div>
          <div className="field">
            <label htmlFor="role">Role</label>
            <input id="role" defaultValue="Platform Engineer" />
          </div>
          <div className="field field-full">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              defaultValue="Building NovaFlow to make automation effortless."
            />
          </div>
        </div>

        <div className="card-actions">
          <Button size="sm">Save changes</Button>
        </div>
      </Card>
    </div>
  );
}