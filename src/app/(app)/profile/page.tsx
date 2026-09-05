import type { Metadata } from "next";
import { AvatarUploader } from "@/components/profile/AvatarUploader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { MailIcon, ShieldIcon, ClockIcon } from "@/components/ui/icons";
import { requireProfile } from "@/utils/auth/dal";
import { formatDate, titleCase } from "@/utils/format";

export const metadata: Metadata = {
  title: "Profile",
};

const STATUS_BADGE: Record<string, string> = {
  active: "badge badge--positive",
  invited: "badge badge--info",
  suspended: "badge badge--critical",
};

export default async function ProfilePage() {
  const profile = await requireProfile();

  return (
    <div className="stack stack--lg rise">
      <header className="page-header">
        <div className="page-header__text">
          <p className="eyebrow">Your account</p>
          <h1 className="title-1">Profile</h1>
          <p className="muted">
            How you appear to the rest of the workspace.
          </p>
        </div>
      </header>

      <section className="card glass">
        <AvatarUploader
          userId={profile.id}
          email={profile.email}
          name={profile.full_name}
          avatarUrl={profile.avatar_url}
        />
      </section>

      <div className="split">
        <section className="card glass">
          <div className="card__header">
            <div className="card__title">
              <h2 className="title-2">Details</h2>
              <p className="muted">Everyone in the workspace can see these.</p>
            </div>
          </div>
          <ProfileForm profile={profile} />
        </section>

        <section className="card glass">
          <div className="card__header">
            <div className="card__title">
              <h2 className="title-2">Account</h2>
              <p className="muted">Managed by your administrator.</p>
            </div>
          </div>

          <ul className="feed">
            <li className="feed__item">
              <span className="feed__marker">
                <MailIcon size={15} />
              </span>
              <div className="feed__body">
                <p className="feed__text truncate">{profile.email}</p>
                <p className="feed__time">Sign-in address</p>
              </div>
            </li>
            <li className="feed__item">
              <span className="feed__marker">
                <ShieldIcon size={15} />
              </span>
              <div className="feed__body">
                <div className="cluster">
                  <span
                    className={profile.role === "admin" ? "badge badge--brand" : "badge"}
                  >
                    {titleCase(profile.role)}
                  </span>
                  <span className={STATUS_BADGE[profile.status] ?? "badge"}>
                    {titleCase(profile.status)}
                  </span>
                </div>
                <p className="feed__time">Role and status</p>
              </div>
            </li>
            <li className="feed__item">
              <span className="feed__marker">
                <ClockIcon size={15} />
              </span>
              <div className="feed__body">
                <p className="feed__text">{formatDate(profile.created_at)}</p>
                <p className="feed__time">Member since</p>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
