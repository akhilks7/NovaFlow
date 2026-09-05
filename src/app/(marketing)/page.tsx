import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Logo, BuilderIcon, PulseIcon, ShieldIcon, ZapIcon, BranchIcon } from "@/components/ui/icons";

const features = [
  {
    title: "Visual builder",
    description:
      "Design complex workflows with a drag-and-drop canvas. Connect triggers, steps, and conditions in minutes — no code required.",
    icon: <BuilderIcon />,
  },
  {
    title: "Real-time monitoring",
    description:
      "Watch every execution live. See failures the moment they happen and drill into detailed run logs from one dashboard.",
    icon: <PulseIcon />,
  },
  {
    title: "Enterprise-grade security",
    description:
      "Every run is isolated and encrypted. Role-based access and full audit trails keep your automations safe and compliant.",
    icon: <ShieldIcon />,
  },
];

const tiers = [
  {
    name: "Starter",
    price: "0",
    tagline: "For side projects and learning",
    features: ["Up to 3 workflows", "500 runs / month", "Community support"],
    href: "/signup",
    label: "Start for free",
    popular: false,
  },
  {
    name: "Pro",
    price: "19",
    tagline: "For growing teams",
    features: ["Unlimited workflows", "50k runs / month", "Priority support", "Scheduled triggers"],
    href: "/signup",
    label: "Start free trial",
    popular: true,
  },
  {
    name: "Business",
    price: "49",
    tagline: "For organizations at scale",
    features: ["Unlimited runs", "SSO & audit logs", "Dedicated support", "Custom integrations"],
    href: "/signup",
    label: "Contact sales",
    popular: false,
  },
];

export default function MarketingPage() {
  return (
    <div className="marketing">
      <header className="mkt-nav">
        <a href="#top" className="brand">
          <Logo />
          NovaFlow
        </a>
        <nav className="mkt-nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="mkt-nav-actions">
          <Button href="/login" variant="secondary" size="sm">
            Sign in
          </Button>
          <Button href="/signup" size="sm">
            Get started
          </Button>
        </div>
      </header>

      <main id="top">
        <section className="mkt-hero">
          <div>
            <h1>
              Build workflows that <span>run themselves</span>.
            </h1>
            <p>
              NovaFlow lets you design, automate, and monitor your business processes from a single
              beautiful dashboard.
            </p>
            <div className="mkt-hero-actions">
              <Button href="/signup" size="lg">
                Get started free
              </Button>
              <Button href="/dashboard" variant="ghost" size="lg">
                View live demo
              </Button>
            </div>
          </div>

          <div className="mkt-hero-visual">
            <div className="flow-node trigger">
              <ZapIcon width="18" height="18" />
              <span>Trigger · New form submit</span>
            </div>
            <div className="flow-connector" />
            <div className="flow-node">
              <BranchIcon width="18" height="18" />
              <span>Route by team</span>
            </div>
            <div className="flow-connector" />
            <div className="flow-node">
              <PulseIcon width="18" height="18" />
              <span>Create ticket</span>
            </div>
            <div className="flow-status">
              <span>All systems running</span>
              <Badge tone="success">Healthy</Badge>
            </div>
          </div>
        </section>

        <section id="features" className="mkt-section">
          <div className="mkt-section-head">
            <h2>Everything you need to automate</h2>
            <p>Small, focused tools that combine into powerful end-to-end workflows.</p>
          </div>
          <div className="features-grid">
            {features.map((feature) => (
              <Card key={feature.title} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="card-title">{feature.title}</h3>
                <p>{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="pricing" className="mkt-section">
          <div className="mkt-section-head">
            <h2>Pricing that scales with you</h2>
            <p>Start free. Upgrade when your automations grow.</p>
          </div>
          <div className="pricing-grid">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`pricing-card${tier.popular ? " pricing-popular" : ""}`}
              >
                {tier.popular && <Badge tone="accent">Most popular</Badge>}
                <h3 className="card-title">{tier.name}</h3>
                <div className="pricing-price">
                  ${tier.price}
                  <small> /month</small>
                </div>
                <p className="t-desc">{tier.tagline}</p>
                <ul className="pricing-features">
                  {tier.features.map((feature) => (
                    <li key={feature}>
                      <span className="check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button href={tier.href} variant={tier.popular ? "primary" : "ghost"} block>
                  {tier.label}
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="mkt-cta">
          <h2>Ready to automate?</h2>
          <p>Create your account in under a minute. No credit card required.</p>
          <Button href="/signup" size="lg">
            Create your account
          </Button>
        </section>
      </main>

      <footer className="mkt-footer">© 2026 NovaFlow — demo build, no real data.</footer>
    </div>
  );
}