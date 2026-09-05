import Link from "next/link";
import {
  ArrowRightIcon,
  BoltIcon,
  CheckIcon,
  ClockIcon,
  FlowIcon,
  LockIcon,
  ShieldIcon,
  TeamIcon,
  WebhookIcon,
} from "@/components/ui/icons";

const FEATURES = [
  {
    Icon: FlowIcon,
    title: "Workflows with a shape",
    body: "Name it, describe it, choose how it fires. Draft, active, paused or archived — the state is always visible.",
  },
  {
    Icon: ShieldIcon,
    title: "Two roles, enforced twice",
    body: "Admins manage the directory, members keep their own workspace. Checked in the app and again by Postgres policies.",
  },
  {
    Icon: BoltIcon,
    title: "An activity trail",
    body: "Every create, edit and role change is written by a database trigger, so the timeline cannot drift from reality.",
  },
  {
    Icon: WebhookIcon,
    title: "Triggers that fit",
    body: "Schedules, incoming webhooks, events, or a manual run when you would rather press the button yourself.",
  },
];

const ROLES = [
  {
    name: "Member",
    tagline: "The everyday account",
    Icon: TeamIcon,
    abilities: [
      "Create and run their own workflows",
      "Edit their profile, photo and password",
      "See their own activity history",
      "Pick a light, dark or automatic theme",
    ],
  },
  {
    name: "Administrator",
    tagline: "Everything a member can do, plus the directory",
    Icon: ShieldIcon,
    featured: true,
    abilities: [
      "Create accounts and set their role",
      "Change any member's role or status",
      "Delete accounts, with the last admin protected",
      "See every workflow and every event",
    ],
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="hero">
        <div className="hero__text rise">
          <p className="eyebrow">Workflow automation</p>
          <h1 className="display">
            Automations your team can <span className="gradient-text">actually read</span>
          </h1>
          <p className="lede">
            NovaFlow keeps every automation, every role and every change in one
            place — with permissions enforced in the database, not just the
            interface.
          </p>
          <div className="cluster" style={{ marginTop: "0.5rem" }}>
            <Link href="/signup" className="btn btn--primary btn--lg">
              Create your workspace
              <ArrowRightIcon size={18} className="btn__icon" />
            </Link>
            <Link href="/login" className="btn btn--glass btn--lg">
              Sign in
            </Link>
          </div>
          <p className="muted" style={{ fontSize: "0.875rem" }}>
            The first account becomes the administrator.
          </p>
        </div>

        {/* A miniature of the real dashboard, built from the same primitives. */}
        <div className="hero__preview glass rise" aria-hidden="true">
          <div className="cluster cluster--between">
            <span className="eyebrow">This week</span>
            <span className="badge badge--positive">
              <span className="badge__dot" />
              4 running
            </span>
          </div>

          <div className="grid" style={{ ["--min" as string]: "104px" }}>
            {[
              { label: "Workflows", value: "12" },
              { label: "Running", value: "4" },
              { label: "Members", value: "7" },
            ].map((tile) => (
              <div key={tile.label} className="hero__tile">
                <p className="stat__value" style={{ fontSize: "1.5rem" }}>
                  {tile.value}
                </p>
                <p className="stat__label">{tile.label}</p>
              </div>
            ))}
          </div>

          <div className="chart" style={{ height: "84px" }}>
            {[38, 62, 45, 80, 55, 92, 70, 48, 66, 100, 74, 58].map((height, index) => (
              <div className="chart__col" key={index}>
                <div
                  className="chart__bar"
                  style={{ height: `${height}%`, animationDelay: `${index * 40}ms` }}
                />
              </div>
            ))}
          </div>

          <div className="hero__row">
            <span className="feed__marker">
              <ClockIcon size={14} />
            </span>
            <span className="grow truncate">Nightly customer sync</span>
            <span className="badge badge--info">Schedule</span>
          </div>
          <div className="hero__row">
            <span className="feed__marker">
              <LockIcon size={14} />
            </span>
            <span className="grow truncate">Access review</span>
            <span className="badge badge--caution">Paused</span>
          </div>
        </div>
      </section>

      <section className="section">
        <header className="section__header">
          <p className="eyebrow">What you get</p>
          <h2 className="title-1">Built like a product, not a template</h2>
        </header>

        <div className="grid grid--wide">
          {FEATURES.map(({ Icon, title, body }) => (
            <article key={title} className="card glass card--interactive">
              <span className="stat__icon" style={{ marginBottom: "0.9rem" }}>
                <Icon size={18} />
              </span>
              <h3 className="title-3">{title}</h3>
              <p className="muted" style={{ marginTop: "0.4rem" }}>
                {body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <header className="section__header">
          <p className="eyebrow">Permissions</p>
          <h2 className="title-1">Two roles, no ambiguity</h2>
          <p className="lede">
            Row level security decides what each account can read and write, so a
            forged request fails at the database rather than the button.
          </p>
        </header>

        <div className="grid grid--wide">
          {ROLES.map(({ name, tagline, Icon, abilities, featured }) => (
            <article
              key={name}
              className={featured ? "card glass role-card role-card--featured" : "card glass role-card"}
            >
              <div className="cluster">
                <span className="stat__icon">
                  <Icon size={18} />
                </span>
                <div>
                  <h3 className="title-2">{name}</h3>
                  <p className="muted" style={{ fontSize: "0.875rem" }}>
                    {tagline}
                  </p>
                </div>
              </div>

              <ul className="role-card__list">
                {abilities.map((ability) => (
                  <li key={ability}>
                    <CheckIcon size={16} />
                    {ability}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="card glass cta">
          <h2 className="title-1">Ready in about a minute</h2>
          <p className="lede">
            Run the migrations, create the first account, and you have a working
            workspace with roles, profiles and an audit trail.
          </p>
          <Link href="/signup" className="btn btn--primary btn--lg">
            Get started
            <ArrowRightIcon size={18} className="btn__icon" />
          </Link>
        </div>
      </section>
    </>
  );
}
