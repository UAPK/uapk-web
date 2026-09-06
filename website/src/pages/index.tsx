import type {ReactNode} from 'react';
import {useEffect, useRef} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import ContactForm from '@site/src/components/ContactForm';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={styles.hero}>
      <div className="container">
        <h1 className={styles.heroTitle}>
          The Agent Firewall for High-Stakes AI
        </h1>
        <p className={styles.heroSubtitle}>
          Govern every AI action with policy enforcement, human approvals, and court-ready audit logs.
          Built for legal, finance, and compliance.
        </p>
        <div className={styles.heroButtons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/quickstart">
            Self-Host Free
          </Link>
          <Link
            className="button button--primary button--lg"
            to="/docs/business/pilot">
            Book Pilot (€15K–€25K)
          </Link>
        </div>
        <p className={styles.heroCtaNote}>
          Self-Host Free is a Docker/CLI setup for technical teams. Enterprise pilots include expert deployment.
        </p>
        <div className={styles.heroBadges}>
          <span className={styles.heroBadge}>
            <span className={styles.heroBadgeCheck}>&#10003;</span> Self-hosted
          </span>
          <span className={styles.heroBadge}>
            <span className={styles.heroBadgeCheck}>&#10003;</span> Apache 2.0 open source
          </span>
          <span className={styles.heroBadge}>
            <span className={styles.heroBadgeCheck}>&#10003;</span> Production-ready in 2–4 weeks
          </span>
        </div>
      </div>
    </header>
  );
}

function QuickDemo() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>See It in Action</h2>
        <p className={styles.sectionSubtitle}>
          Every agent action flows through the gateway for policy enforcement and audit logging.
        </p>
        <div className={styles.divider} />
        <div className="row">
          <div className="col col--6">
            <pre className={styles.codeBlock}>
{`# Agent proposes action
curl -X POST /gateway/execute \\
  -H "X-API-Key: $KEY" \\
  -d '{
    "uapk_id": "settlement-bot",
    "action": {
      "type": "legal",
      "tool": "send_settlement_offer",
      "params": {"amount": 5000}
    }
  }'

# Gateway response
{
  "decision": "ALLOW",
  "executed": true,
  "interaction_id": "int-abc123"
}`}
            </pre>
          </div>
          <div className="col col--6">
            <h3>What Just Happened?</h3>
            <ul className={styles.demoExplanation}>
              <li><strong>Manifest check</strong> — Is settlement-bot registered?</li>
              <li><strong>Capability check</strong> — Can it send settlements?</li>
              <li><strong>Budget check</strong> — $5K under $50K threshold</li>
              <li><strong>Policy check</strong> — Passed all rules</li>
              <li><strong>Executed</strong> via connector</li>
              <li><strong>Logged</strong> with hash chain + Ed25519 signature</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function BeforeAfter() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Before vs After</h2>
        <div className={styles.divider} />
        <div className="row">
          <div className="col col--6">
            <div className={clsx(styles.comparisonCard, styles.comparisonBefore)}>
              <h3 className={clsx(styles.comparisonTitle, styles.comparisonTitleBefore)}>
                Without UAPK
              </h3>
              <ul>
                <li>Compliance blocks every agent deployment</li>
                <li>"Who authorized this?" — no attribution</li>
                <li>"Can we prove it in court?" — no audit trail</li>
                <li>"How do we stop it?" — no kill switch</li>
                <li>Months of back-and-forth with legal/compliance</li>
                <li>Vendor logs — 90-day retention, not court-admissible</li>
              </ul>
            </div>
          </div>
          <div className="col col--6">
            <div className={clsx(styles.comparisonCard, styles.comparisonAfter)}>
              <h3 className={clsx(styles.comparisonTitle, styles.comparisonTitleAfter)}>
                With UAPK
              </h3>
              <ul>
                <li><strong>Policy enforcement:</strong> ALLOW / DENY / ESCALATE</li>
                <li><strong>Attribution:</strong> Every action traced to agent + manifest</li>
                <li><strong>Court-ready logs:</strong> Hash-chained, Ed25519 signed</li>
                <li><strong>Human approvals:</strong> High-risk actions reviewed</li>
                <li><strong>Production in 2–4 weeks:</strong> Fixed-fee pilot</li>
                <li><strong>Your evidence:</strong> Self-hosted, indefinite retention</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FortySevenersShowcase() {
  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <h2 className={styles.sectionTitle}>The "47ers" Library</h2>
        <p className={styles.sectionSubtitle}>
          Pre-built governance templates — drop-in manifests that wire up policy enforcement, approval thresholds, and audit rules for the most common regulated workflows. Deploy in minutes, not weeks.
        </p>
        <div className={styles.divider} />
        <div className="row">
          <div className="col col--4">
            <div className={styles.fortySevenCard}>
              <div className={styles.fortySevenCategory}>Legal</div>
              <h3>Litigation & IP</h3>
              <ul>
                <li><strong>IP Settlement Gate:</strong> Auto-negotiate up to $50K, escalate above</li>
                <li><strong>DMCA Takedown:</strong> 200 notices/day with compliance tracking</li>
              </ul>
              <Link to="/docs/47ers">View templates →</Link>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.fortySevenCard}>
              <div className={styles.fortySevenCategory}>Finance</div>
              <h3>Trading & KYC</h3>
              <ul>
                <li><strong>Trading Gate:</strong> $10K auto-execute, $100K daily cap</li>
                <li><strong>KYC Onboarding:</strong> Risk-based routing + sanctions screening</li>
              </ul>
              <Link to="/docs/47ers">View templates →</Link>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.fortySevenCard}>
              <div className={styles.fortySevenCategory}>Compliance</div>
              <h3>Audit & Controls</h3>
              <ul>
                <li><strong>Vendor Due Diligence:</strong> Automated risk assessment</li>
                <li><strong>Email Guard:</strong> Rate limits + recipient validation</li>
              </ul>
              <Link to="/docs/47ers">View templates →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntegrationsRow() {
  const integrations = [
    { name: 'Make.com', desc: 'Custom app', href: '/docs/integrations/make' },
    { name: 'Zapier', desc: 'Community app', href: '/docs/integrations/zapier' },
    { name: 'n8n', desc: 'Community node', href: '/docs/integrations/n8n' },
    { name: 'Langflow', desc: 'PyPI components', href: '/docs/integrations/langflow' },
    { name: 'Python SDK', desc: 'LangChain-ready', href: '/docs/guides/agent-integration' },
    { name: 'REST API', desc: 'Any stack', href: '/docs/api' },
  ];
  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Works with Your Stack</h2>
        <p className={styles.sectionSubtitle}>
          Drop UAPK Gateway into whatever automation platform you already use.
        </p>
        <div className={styles.divider} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {integrations.map(({ name, desc, href }) => (
            <Link key={name} to={href} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '1rem 1.5rem',
                border: '1px solid var(--uapk-border)',
                borderRadius: '10px',
                background: 'var(--uapk-surface-elevated)',
                textAlign: 'center',
                minWidth: '130px',
                transition: 'box-shadow 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,0.10)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--uapk-text-primary)' }}>{name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--uapk-text-secondary)', marginTop: '0.25rem' }}>{desc}</div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/docs/integrations/make" className="button button--outline button--primary">
            View Integration Docs →
          </Link>
        </div>
      </div>
    </section>
  );
}

function GovStackSection() {
  const cols = [
    {
      label: 'Governance infrastructure',
      name: 'UAPK Gateway',
      desc: 'Apache 2.0 policy enforcement and audit middleware. Self-host in 5 minutes. All core features free — policy engine, capability tokens, approvals, tamper-evident logs.',
      tag: 'Free · Open Source',
      tagColor: '#34b06a',
      href: '/docs/quickstart',
      linkText: 'Get started →',
    },
    {
      label: 'AI consulting & implementation',
      name: 'Lawkraft',
      desc: 'Expert deployment for regulated environments. Custom AI systems, compliance documentation, and UAPK pilots. No hand-offs, no juniors — delivered by the same person who built the technology.',
      tag: 'Pilot · Blueprint',
      tagColor: 'var(--ifm-color-primary)',
      href: 'https://lawkraft.com',
      linkText: 'lawkraft.com →',
    },
    {
      label: 'Legal review & regulatory strategy',
      name: 'Hucke & Sanker',
      desc: 'Boutique transnational law firm. AI Regulatory Strategy practice covering EU AI Act, GDPR for AI/ML, and capital markets compliance. Manifests reviewed as legal instruments by licensed counsel.',
      tag: 'Enterprise · Ongoing',
      tagColor: '#c27c1a',
      href: 'https://huckesanker.com',
      linkText: 'huckesanker.com →',
    },
  ];

  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <h2 className={styles.sectionTitle}>The governance stack</h2>
        <p className={styles.sectionSubtitle}>
          Open source gives you the engine. Professional engagement adds expert implementation
          and legal review from a Rechtsanwalt with 12 years PQE.
        </p>
        <div className={styles.divider} />
        <div className="row" style={{ alignItems: 'stretch' }}>
          {cols.map(col => (
            <div key={col.name} className="col col--4">
              <div style={{
                padding: '2rem',
                border: '1px solid var(--uapk-border)',
                borderRadius: 12,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--uapk-surface-elevated)',
              }}>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--uapk-text-secondary)',
                  marginBottom: '0.5rem',
                }}>
                  {col.label}
                </div>
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--uapk-text-primary)',
                  marginBottom: '0.5rem',
                }}>
                  {col.name}
                </h3>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: col.tagColor,
                  marginBottom: '0.9rem',
                }}>
                  {col.tag}
                </div>
                <p style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  color: 'var(--uapk-text-secondary)',
                  flex: 1,
                  marginBottom: '1.5rem',
                }}>
                  {col.desc}
                </p>
                <Link
                  to={col.href}
                  style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ifm-color-primary)' }}
                >
                  {col.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/about" style={{ fontSize: '0.9rem', color: 'var(--uapk-text-secondary)' }}>
            Who built this and why →
          </Link>
        </div>
      </div>
    </section>
  );
}

type EngagementTier = {
  name: string;
  price: string;
  timeline: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlight: boolean;
};

function PricingSection() {
  const tiers: EngagementTier[] = [
    {
      name: 'Open Source',
      price: 'Free',
      timeline: 'Self-hosted',
      description: 'Full policy engine, approvals, and audit logs. Run it on your own infrastructure.',
      features: ['All core features', 'Apache 2.0 license', '47ers template library', 'Docker Compose deploy', 'Community support'],
      cta: 'Get Started Free',
      href: '/docs/quickstart',
      highlight: false,
    },
    {
      name: 'Blueprint Package',
      price: '€5K–€10K',
      timeline: '1–2 weeks',
      description: 'Governance design before you build — manifest architecture, policy map, and implementation roadmap.',
      features: ['Agent roles + action map', 'Policy manifest design', 'Approval threshold spec', 'Integration architecture', 'Implementation roadmap'],
      cta: 'Get in Touch',
      href: 'mailto:mail@uapk.info?subject=Blueprint Package',
      highlight: false,
    },
    {
      name: 'Agent Governance Pilot',
      price: '€15K–€25K',
      timeline: '2–4 weeks',
      description: 'Expert-led deployment for one high-value workflow — from kickoff to production.',
      features: ['Production-ready manifest', 'Self-hosted on your infra', 'Approval workflows live', 'Evidence-grade audit logs', '30-day post-pilot support'],
      cta: 'Book a Pilot',
      href: 'mailto:mail@uapk.info?subject=Agent Governance Pilot',
      highlight: true,
    },
    {
      name: 'Enterprise Support',
      price: '€3K–€10K',
      timeline: '/month',
      description: 'Ongoing support for production deployments — custom connectors, SLA, compliance exports.',
      features: ['Custom connectors', 'S3 COMPLIANCE audit export', '4h SLA, 99.9% uptime', 'Version upgrades', 'Dedicated support channel'],
      cta: 'Contact Us',
      href: 'mailto:mail@uapk.info?subject=Enterprise Support',
      highlight: false,
    },
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Simple, Transparent Pricing</h2>
        <p className={styles.sectionSubtitle}>
          Start free and self-host, or engage for expert-led deployment in regulated environments.
        </p>
        <div className={styles.divider} />
        <div className="row" style={{ alignItems: 'stretch' }}>
          {tiers.map(tier => (
            <div key={tier.name} className="col col--3">
              <div style={{
                padding: '1.75rem',
                border: `1px solid ${tier.highlight ? 'var(--ifm-color-primary)' : 'var(--uapk-border)'}`,
                borderTop: `3px solid ${tier.highlight ? 'var(--ifm-color-primary)' : 'var(--uapk-border)'}`,
                borderRadius: '12px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: tier.highlight ? 'var(--uapk-surface-elevated)' : 'transparent',
                position: 'relative',
              }}>
                {tier.highlight && (
                  <div style={{
                    position: 'absolute',
                    top: '-1px',
                    right: '1.25rem',
                    background: 'var(--ifm-color-primary)',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '0 0 6px 6px',
                  }}>Most Popular</div>
                )}
                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ifm-color-primary)', marginBottom: '0.5rem' }}>{tier.name}</div>
                <div style={{ marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '1.9rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--uapk-text-primary)' }}>{tier.price}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--uapk-text-secondary)', marginBottom: '0.75rem' }}>{tier.timeline}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--uapk-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>{tier.description}</p>
                <ul style={{ listStyle: 'none', padding: 0, flex: 1, marginBottom: '1.5rem' }}>
                  {tier.features.map(f => (
                    <li key={f} style={{ padding: '0.3rem 0', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <span style={{ color: '#34b06a', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={tier.href}
                  className={`button button--${tier.highlight ? 'primary' : 'outline button--primary'} button--block`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--uapk-text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            All commercial engagements deploy UAPK Gateway to <strong>your</strong> infrastructure — you own your data, evidence, and compliance posture.
          </p>
          <p style={{ color: 'var(--uapk-text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Blueprint fee credited in full toward a Pilot if you engage within 90 days.
          </p>
          <Link to="/docs/business/pricing" className="button button--outline button--primary">
            Not sure where to start? Book a free 45-min governance assessment →
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyNotObsolete() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Why UAPK Won't Be Obsolete</h2>
        <div className={styles.divider} />
        <div className={styles.whyContent}>
          <p className={styles.whyCenterText}>
            Model vendors will improve. Your governance requirements won't change.
          </p>
          <div className="row">
            <div className="col col--6">
              <div className={styles.whyNumber}>01</div>
              <h4>Model-Agnostic by Design</h4>
              <p>
                UAPK governs <strong>actions at the boundary</strong> to real systems.
                It doesn't care which model you use — GPT-4, Claude, Llama, or Gemini.
              </p>
            </div>
            <div className="col col--6">
              <div className={styles.whyNumber}>02</div>
              <h4>Regulation Requires It</h4>
              <p>
                SOC2, GDPR, SEC audits require <strong>organization-owned evidence</strong>.
                "Check the OpenAI logs" doesn't work in court.
              </p>
            </div>
          </div>
          <div style={{textAlign: 'center', marginTop: '2.5rem'}}>
            <Link to="/docs/concepts/future-proof" className="button button--primary">
              Read the full argument →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


function BookingWidget() {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!widgetRef.current) return;
    if (document.querySelector('script[src*="book.lawkraft.com/widget/scheduler.js"]')) return;
    const script = document.createElement('script');
    script.src = 'https://book.lawkraft.com/widget/scheduler.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section style={{padding: '4rem 0', textAlign: 'center'}}>
      <div className="container">
        <h2 style={{fontSize: '1.8rem', marginBottom: '0.5rem'}}>Book a Free Product Demo</h2>
        <p style={{color: 'var(--uapk-text-secondary, #94a3b8)', marginBottom: '2rem'}}>
          20 minutes with David Sanker — see the UAPK agent firewall in action.
        </p>
        <div
          ref={widgetRef}
          id="fc-scheduler"
          data-brand="uapk"
          data-type="product-demo"
          data-api="https://book.lawkraft.com"
          style={{maxWidth: '520px', margin: '0 auto'}}
        />
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <h2 className={styles.ctaTitle}>Ready to Deploy Agents Safely?</h2>
        <p className={styles.ctaSubtitle}>
          Expert help from David Sanker — Rechtsanwalt, BAFin-certified AI expert, and the
          engineer who built this for real-world compliance needs
        </p>

        <ContactForm />

        <div className={styles.ctaLinks}>
          <p style={{marginBottom: '0.75rem'}}>
            <strong>Or explore on your own:</strong>
          </p>
          <p>
            <Link to="/docs/quickstart">Self-Host (Free)</Link>
            {' · '}
            <Link to="/docs/business/pricing">View Pricing</Link>
            {' · '}
            <Link to="https://github.com/UAPK/gateway">View on GitHub</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function CaseStudySection() {
  const steps = [
    {
      n: '01',
      label: 'Action proposed',
      detail: 'Settlement bot calls POST /gateway/execute with action type legal, tool send_settlement_offer, amount €5,000 toward counterparty in an IP dispute.',
    },
    {
      n: '02',
      label: 'Policy engine runs',
      detail: 'Gateway checks manifest identity, capability token, amount against the €50K threshold, jurisdiction allowlist, and daily budget. All pass. Decision: ALLOW.',
    },
    {
      n: '03',
      label: 'Connector executes',
      detail: 'HTTP connector sends the offer via the firm\'s outbound API. Response captured and attached to the interaction record.',
    },
    {
      n: '04',
      label: 'Audit record written',
      detail: 'Tamper-evident record created: request hash, result hash, Ed25519 gateway signature, and SHA-256 link to the previous record in the chain.',
    },
    {
      n: '05',
      label: 'Evidence bundle ready',
      detail: 'Compliance team exports the S3 Object Lock bundle. The chain integrity check passes. The record is court-admissible and regulator-ready.',
    },
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            color: 'var(--ifm-color-primary)',
            marginBottom: '0.75rem',
          }}>
            Reference deployment
          </div>
          <h2 className={styles.sectionTitle} style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
            IP settlement agent — from proposal to evidence
          </h2>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--uapk-text-secondary)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}>
            A law firm's settlement bot needs to negotiate IP disputes autonomously — but compliance requires human approval above €50K and a court-admissible audit trail for every action taken. This is what one gateway execution looks like end-to-end.
          </p>

          <div style={{ position: 'relative' }}>
            {steps.map((step, i) => (
              <div key={step.n} style={{
                display: 'flex',
                gap: '1.5rem',
                marginBottom: i < steps.length - 1 ? '0' : '0',
                position: 'relative',
              }}>
                {/* timeline column */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', flexShrink: 0, width: 40 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--ifm-color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: 'white',
                    letterSpacing: '0.04em',
                    flexShrink: 0,
                    zIndex: 1,
                    position: 'relative',
                  }}>
                    {step.n}
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{
                      width: 2,
                      flex: 1,
                      minHeight: 32,
                      background: 'var(--uapk-border)',
                      margin: '4px 0',
                    }} />
                  )}
                </div>
                {/* content */}
                <div style={{ paddingBottom: i < steps.length - 1 ? '1.5rem' : 0, flex: 1 }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--uapk-text-primary)',
                    marginBottom: '0.3rem',
                    lineHeight: 1.4,
                  }}>
                    {step.label}
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--uapk-text-secondary)',
                    lineHeight: 1.65,
                    margin: 0,
                  }}>
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '2.5rem',
            padding: '1.25rem 1.5rem',
            background: 'var(--uapk-surface-elevated)',
            border: '1px solid var(--uapk-border)',
            borderLeft: '3px solid #34b06a',
            borderRadius: 8,
            fontSize: '0.875rem',
            color: 'var(--uapk-text-secondary)',
            lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--uapk-text-primary)' }}>Outcome:</strong> Compliance signed off in week one of the pilot. Audit records passed chain integrity verification. The evidence bundle met the standard required for court submission. Settlement offers above the €50K threshold trigger an escalation to a human approver before execution — the bot never touches those unilaterally.
          </div>

          <div style={{ marginTop: '1.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' as const }}>
            <Link to="/docs/business/pilot" className="button button--primary">
              See how a pilot works →
            </Link>
            <Link to="/docs/47ers" className="button button--outline button--primary">
              Browse governance templates →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function BuyerPathSection() {
  const paths = [
    {
      icon: '⌨',
      who: "I'm technical",
      desc: 'Set up the full policy engine, capability tokens, and audit logs on your own infrastructure.',
      price: 'Free',
      priceNote: 'Docker / CLI setup',
      cta: 'View Quickstart',
      href: '/docs/quickstart',
      highlight: false,
    },
    {
      icon: '⚖',
      who: 'I need governance design first',
      desc: 'Design manifest architecture and policy map for your agent before writing a line of code.',
      price: '€5K–€10K',
      priceNote: '1–2 week engagement',
      cta: 'Get in Touch',
      href: 'mailto:mail@uapk.info?subject=Blueprint Package',
      highlight: false,
    },
    {
      icon: '🚀',
      who: 'I need one workflow live fast',
      desc: 'Expert-led deployment from kickoff to production for one high-value regulated workflow.',
      price: '€15K–€25K',
      priceNote: '2–4 week pilot',
      cta: 'Book a Pilot',
      href: 'mailto:mail@uapk.info?subject=Agent Governance Pilot',
      highlight: true,
    },
  ];

  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Where do you start?</h2>
        <p className={styles.sectionSubtitle}>
          Three paths into UAPK — pick the one that matches where you are right now.
        </p>
        <div className={styles.divider} />
        <div className="row" style={{ alignItems: 'stretch' }}>
          {paths.map(path => (
            <div key={path.who} className="col col--4">
              <div style={{
                padding: '2rem',
                border: `1px solid ${path.highlight ? 'var(--ifm-color-primary)' : 'var(--uapk-border)'}`,
                borderTop: `3px solid ${path.highlight ? 'var(--ifm-color-primary)' : 'var(--uapk-border)'}`,
                borderRadius: 12,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: path.highlight ? 'var(--uapk-surface-elevated)' : 'transparent',
                position: 'relative',
              }}>
                {path.highlight && (
                  <div style={{
                    position: 'absolute',
                    top: '-1px',
                    right: '1.25rem',
                    background: 'var(--ifm-color-primary)',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '0 0 6px 6px',
                  }}>Most common</div>
                )}
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{path.icon}</div>
                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: 'var(--uapk-text-primary)',
                  marginBottom: '0.75rem',
                  letterSpacing: '-0.01em',
                }}>
                  {path.who}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.65,
                  color: 'var(--uapk-text-secondary)',
                  flex: 1,
                  marginBottom: '1.5rem',
                }}>
                  {path.desc}
                </p>
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--uapk-text-primary)', letterSpacing: '-0.02em' }}>
                    {path.price}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--uapk-text-secondary)', marginLeft: '0.5rem' }}>
                    {path.priceNote}
                  </span>
                </div>
                <Link
                  to={path.href}
                  className={`button button--${path.highlight ? 'primary' : 'outline button--primary'} button--block`}
                >
                  {path.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BestFitSection() {
  const bestFit = [
    'Legal ops agents (settlement, due diligence, contract review)',
    'KYC / AML onboarding workflows with sanctions screening',
    'Internal agent approvals for regulated outbound actions',
    'Finance agents writing payments, transfers, or trade orders',
    'Any AI system where "what did it do and who approved it?" matters to auditors',
  ];
  const notIdeal = [
    'Casual chatbots or Q&A assistants with no external actions',
    'Generic content generation or summarisation pipelines',
    'Low-risk internal copilots with no regulatory exposure',
    'Agents that only read data and never write or send anything',
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Who should buy this first?</h2>
        <p className={styles.sectionSubtitle}>
          UAPK is built for one specific problem: AI agents taking consequential, externally-visible actions in regulated environments.
        </p>
        <div className={styles.divider} />
        <div className="row">
          <div className="col col--6">
            <div style={{
              padding: '1.75rem',
              border: '1px solid #34b06a',
              borderTop: '3px solid #34b06a',
              borderRadius: 10,
              background: 'var(--uapk-surface-elevated)',
              height: '100%',
            }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#34b06a',
                marginBottom: '1rem',
              }}>
                Best first fit
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {bestFit.map(item => (
                  <li key={item} style={{
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    color: 'var(--uapk-text-secondary)',
                    padding: '0.35rem 0',
                    display: 'flex',
                    gap: '0.6rem',
                    alignItems: 'flex-start',
                  }}>
                    <span style={{ color: '#34b06a', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col col--6">
            <div style={{
              padding: '1.75rem',
              border: '1px solid var(--uapk-border)',
              borderTop: '3px solid var(--uapk-border)',
              borderRadius: 10,
              background: 'transparent',
              height: '100%',
            }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--uapk-text-secondary)',
                marginBottom: '1rem',
              }}>
                Not ideal first fit
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {notIdeal.map(item => (
                  <li key={item} style={{
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    color: 'var(--uapk-text-secondary)',
                    padding: '0.35rem 0',
                    display: 'flex',
                    gap: '0.6rem',
                    alignItems: 'flex-start',
                    opacity: 0.7,
                  }}>
                    <span style={{ color: 'var(--uapk-border)', fontWeight: 700, flexShrink: 0 }}>–</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Policy enforcement and audit logging for AI agents. Deploy autonomous agents with hard guardrails, human approvals, and tamper-evident audit logs.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <BuyerPathSection />
        <QuickDemo />
        <CaseStudySection />
        <BeforeAfter />
        <BestFitSection />
        <FortySevenersShowcase />
        <IntegrationsRow />
        <GovStackSection />
        <PricingSection />
        <WhyNotObsolete />
        <BookingWidget />
        <FinalCTA />
      </main>
    </Layout>
  );
}
