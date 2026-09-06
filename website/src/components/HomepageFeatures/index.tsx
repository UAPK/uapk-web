import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

/* ─── Inline SVG Icons ─── */
function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function UserCheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

function FileChainIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}

function BarrierIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="7" y1="11" x2="17" y2="11" />
      <line x1="12" y1="6" x2="12" y2="16" />
    </svg>
  );
}

type FeatureItem = {
  title: string;
  icon: ReactNode;
  description: ReactNode;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Policy Enforcement',
    icon: <ShieldIcon />,
    description: (
      <>
        <strong>ALLOW, DENY, or ESCALATE</strong> decisions based on manifests, budgets, and risk hooks.
        Non-bypassable enforcement at the action boundary.
      </>
    ),
    link: '/docs/concepts/decisions',
  },
  {
    title: 'Human Approvals',
    icon: <UserCheckIcon />,
    description: (
      <>
        High-risk actions <strong>escalate to operators</strong> for review.
        Web UI + API with 5-minute SLA. Full audit trail of every decision.
      </>
    ),
    link: '/docs/concepts/approvals',
  },
  {
    title: 'Tamper-Evident Logs',
    icon: <FileChainIcon />,
    description: (
      <>
        <strong>Hash-chained, Ed25519-signed</strong> interaction records.
        Cryptographically verifiable audit logs for regulators and courts.
      </>
    ),
    link: '/docs/concepts/logs',
  },
  {
    title: 'Prompt-Injection Protection',
    icon: <BarrierIcon />,
    description: (
      <>
        <strong>Agent firewall at the action boundary.</strong> Untrusted
        content is labelled, destinations are policy-checked, and approval
        tokens can't exfiltrate. Prompt injection, SSRF, and tool-hijack
        all fail closed.
      </>
    ),
    link: '/security/prompt-injection',
  },
];

function Feature({title, icon, description, link}: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>
          {icon}
        </div>
        <h3 className={styles.featureTitle}>{title}</h3>
        <p className={styles.featureDescription}>{description}</p>
        <Link to={link} className={styles.featureLink}>Learn more →</Link>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <div className={styles.testimonials}>
      <div className="container">
        <h3 className={styles.testimonialsTitle}>
          What Customers Say
        </h3>
        <div className="row">
          <div className="col col--4">
            <blockquote className={styles.testimonialQuote}>
              "The pilot paid for itself in the first month."
            </blockquote>
            <div className={styles.testimonialAttribution}>
              — <strong>Managing Partner</strong>, IP Litigation Boutique
            </div>
          </div>
          <div className="col col--4">
            <blockquote className={styles.testimonialQuote}>
              "Got to production in 3 weeks. The audit trail was exactly what regulators wanted."
            </blockquote>
            <div className={styles.testimonialAttribution}>
              — <strong>CTO</strong>, Series B Fintech
            </div>
          </div>
          <div className="col col--4">
            <blockquote className={styles.testimonialQuote}>
              "We can finally say 'yes' to AI agents without sacrificing governance."
            </blockquote>
            <div className={styles.testimonialAttribution}>
              — <strong>Director of Compliance</strong>, Regional Bank
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <>
      <section className={styles.features}>
        <div className="container">
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
