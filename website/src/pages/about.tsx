import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

// ── Hero ──────────────────────────────────────────────────────────────────────

function AboutHero() {
  return (
    <section style={{
      padding: '5rem 0 4rem',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(79,70,229,0.06) 0%, transparent 70%)',
      textAlign: 'center',
    }}>
      <div className="container">
        {/* DS monogram — placeholder until photo */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'var(--ifm-color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.35rem',
          fontWeight: 700,
          color: 'white',
          letterSpacing: '-0.01em',
          margin: '0 auto 1.75rem',
          flexShrink: 0,
        }}>
          DS
        </div>

        <h1 style={{
          fontSize: '2.6rem',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          color: 'var(--uapk-text-primary)',
          maxWidth: 680,
          margin: '0 auto 1.25rem',
        }}>
          Built because compliance needed it.<br />
          Not because the market wanted it.
        </h1>

        <p style={{
          fontFamily: 'var(--uapk-font-serif)',
          fontStyle: 'italic',
          fontSize: '1.15rem',
          color: 'var(--uapk-text-secondary)',
          maxWidth: 560,
          margin: '0 auto 2.5rem',
          lineHeight: 1.6,
        }}>
          A practicing attorney built the governance infrastructure that AI agents
          actually need — not by reading regulations, but by deploying agents,
          hitting the wall, and building the solution.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="button button--primary" to="/docs/contact">
            Request Governance Assessment
          </Link>
          <Link className="button button--secondary" to="/docs/quickstart">
            Read the Docs
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Origin Story ──────────────────────────────────────────────────────────────

function OriginStory() {
  return (
    <section style={{ padding: '5rem 0', borderTop: '1px solid var(--uapk-border)' }}>
      <div className="container">
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            color: 'var(--ifm-color-primary)',
            marginBottom: '1.25rem',
          }}>
            The Story
          </div>

          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: '2rem',
            color: 'var(--uapk-text-primary)',
          }}>
            From law practice to AI governance
          </h2>

          <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--uapk-text-secondary)' }}>
            <p>
              I founded Hucke & Sanker in 2014 with one conviction: a law firm should
              be technology-enabled from day one. Most legal practices still run on manual
              processes despite handling the most consequential information in business —
              contracts, IP, financial instruments, evidence. That gap always seemed worth closing.
            </p>

            <p>
              In 2016, I founded{' '}
              <strong style={{ color: 'var(--uapk-text-primary)' }}>CR Legal Tech GmbH</strong>
              {' '}— a D2C legal platform providing access to justice at scale, building apps
              that automated consumer law, criminal law, and tort law workflows. That taught
              me what legal work actually looks like when stripped to its essential logic:
              rules applied to facts, with documented decisions. CR Legal Tech was sold in 2022.
            </p>

            <p>
              After the exit, I deepened into AI — specifically building custom solutions for
              financial companies and law firms through{' '}
              <Link to="https://lawkraft.com">Lawkraft</Link>
              . The work ranged from automated due diligence and portfolio tracking to NLP
              for legal analysis and agentic systems for IP enforcement (
              <Link to="https://morpheusmark.com">Morpheus Mark</Link>).
            </p>

            <p>
              What I kept finding: every organisation deploying AI agents in regulated
              environments faces the same wall. The agents work. Then compliance
              asks —{' '}
              <em style={{ color: 'var(--uapk-text-primary)' }}>
                what exactly did the agent do, under whose authority, with what constraints,
                and where is the evidence?
              </em>
              {' '}— and everything stops.
            </p>

            <p>
              UAPK is the answer to that question. Not a theoretical framework — the
              specific infrastructure that every serious AI deployment in a regulated
              environment needs, built by someone who has needed it and couldn't find it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Professional Profile ──────────────────────────────────────────────────────

const CREDENTIALS = [
  {
    category: 'Licensed Practice',
    items: [
      'Rechtsanwalt — Federal Bar Association Germany, since 2014',
      'Foreign Legal Counsel — New York State, Appellate Division at the Supreme Court, since 2024',
    ],
  },
  {
    category: 'Certified',
    items: [
      'BAFin Certified: Digital Transformation and AI Expert — since 2019',
      'Specialist Solicitor: Corporate Law & M&A (CLE Institute von Fürstenberg) — 2018/19',
      'Specialist Solicitor: Criminal Law (CLE Institute von Fürstenberg) — 2012',
    ],
  },
  {
    category: 'Education',
    items: [
      'Juris Doctor equivalent (First State Exam) — University of Cologne, Faculty of Law',
      'Certificate: Law of the United States (CUSL) — University of Cologne',
      'Second State Exam (Clerkship) — District Court Cologne, North-Rhine-Westphalia',
      'Blockchain Law & Applications — MIT Sloan School of Management',
      'Transnational Law and Justice — UNICRI (United Nations), Turin',
    ],
  },
];

const PRACTICE_AREAS = [
  'Capital Markets',
  'International IP',
  'Transnational Criminal Law',
  'White-Collar Defence',
  'AI Regulatory Strategy',
];

function ProfileSection() {
  return (
    <section style={{
      padding: '5rem 0',
      background: 'var(--uapk-surface-subtle)',
      borderTop: '1px solid var(--uapk-border)',
      borderBottom: '1px solid var(--uapk-border)',
    }}>
      <div className="container">
        <div className="row">
          {/* Left: identity block */}
          <div className="col col--4">
            <div style={{ position: 'sticky', top: '2rem' }}>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                color: 'var(--ifm-color-primary)',
                marginBottom: '1rem',
              }}>
                The Founder
              </div>

              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                marginBottom: '0.4rem',
                color: 'var(--uapk-text-primary)',
              }}>
                David Sanker
              </h2>

              <p style={{
                color: 'var(--uapk-text-secondary)',
                fontSize: '0.9rem',
                lineHeight: 1.65,
                marginBottom: '0.5rem',
              }}>
                Rechtsanwalt · NY Foreign Counsel
              </p>

              <p style={{
                color: 'var(--uapk-text-secondary)',
                fontSize: '0.9rem',
                lineHeight: 1.65,
                marginBottom: '1.75rem',
              }}>
                Partner, Hucke & Sanker · 12 years PQE
              </p>

              <div style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
                color: 'var(--uapk-text-secondary)',
                marginBottom: '0.6rem',
              }}>
                Practice areas
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.4rem', marginBottom: '2rem' }}>
                {PRACTICE_AREAS.map(area => (
                  <span key={area} style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.6rem',
                    background: 'var(--uapk-surface-elevated)',
                    border: '1px solid var(--uapk-border)',
                    borderRadius: 4,
                    color: 'var(--uapk-text-secondary)',
                  }}>
                    {area}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
                <Link
                  href="https://de.linkedin.com/in/sankerlaw"
                  style={{ fontSize: '0.875rem', color: 'var(--ifm-color-primary)', fontWeight: 500 }}
                >
                  LinkedIn →
                </Link>
                <Link
                  href="https://huckesanker.com"
                  style={{ fontSize: '0.875rem', color: 'var(--ifm-color-primary)', fontWeight: 500 }}
                >
                  Hucke & Sanker →
                </Link>
                <Link
                  href="https://lawkraft.com"
                  style={{ fontSize: '0.875rem', color: 'var(--ifm-color-primary)', fontWeight: 500 }}
                >
                  Lawkraft →
                </Link>
              </div>
            </div>
          </div>

          {/* Right: credentials */}
          <div className="col col--8">
            {CREDENTIALS.map(group => (
              <div key={group.category} style={{ marginBottom: '2.5rem' }}>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--uapk-text-secondary)',
                  marginBottom: '0.75rem',
                  borderBottom: '1px solid var(--uapk-border)',
                  paddingBottom: '0.5rem',
                }}>
                  {group.category}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {group.items.map(item => (
                    <li key={item} style={{
                      fontSize: '0.95rem',
                      lineHeight: 1.65,
                      color: 'var(--uapk-text-secondary)',
                      padding: '0.4rem 0',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start',
                    }}>
                      <span style={{ color: 'var(--ifm-color-primary)', fontWeight: 600, flexShrink: 0 }}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--uapk-surface-elevated)',
              border: '1px solid var(--uapk-border)',
              borderLeft: '3px solid var(--ifm-color-primary)',
              borderRadius: 8,
              fontSize: '0.9rem',
              lineHeight: 1.7,
              color: 'var(--uapk-text-secondary)',
            }}>
              David speaks German (native) and English (fluent). He is based between
              Cologne, Brighton, and New York.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Ecosystem ─────────────────────────────────────────────────────────────────

const ECOSYSTEM_ENTITIES = [
  {
    label: 'Law Firm',
    name: 'Hucke & Sanker',
    desc: 'Boutique transnational law firm with offices in Cologne, Brighton, and New York. Practice: cross-border IP enforcement, AI regulatory strategy (EU AI Act, GDPR for AI/ML systems), global M&A, and white-collar defence. Partner-led representation at the intersection of technology, finance, and public policy.',
    href: 'https://huckesanker.com',
    linkText: 'huckesanker.com →',
  },
  {
    label: 'AI Consulting',
    name: 'Lawkraft',
    desc: 'AI consulting practice delivering custom AI systems for regulated industries — strategy, implementation, and compliance documentation under one roof. Sectors: legal services, insurance, banking and finance. The only consultant who codes the pilot and writes the compliance docs. No hand-offs, no juniors.',
    href: 'https://lawkraft.com',
    linkText: 'lawkraft.com →',
  },
  {
    label: 'Governance Infrastructure',
    name: 'UAPK Gateway',
    desc: 'Apache 2.0 policy enforcement and audit middleware for AI agents. Patent pending. The enforcement engine that both Lawkraft-delivered deployments and self-hosted implementations run on. All core features free and open-source — professional engagements provide legal review and expert implementation.',
    href: '/docs/intro',
    linkText: 'Read the docs →',
  },
];

function EcosystemSection() {
  return (
    <section style={{ padding: '5rem 0', borderTop: '1px solid var(--uapk-border)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            color: 'var(--ifm-color-primary)',
            marginBottom: '1rem',
          }}>
            The Ecosystem
          </div>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem',
            color: 'var(--uapk-text-primary)',
          }}>
            Three entities. One governance posture.
          </h2>
          <p style={{
            fontFamily: 'var(--uapk-font-serif)',
            fontStyle: 'italic',
            fontSize: '1.05rem',
            color: 'var(--uapk-text-secondary)',
            maxWidth: 540,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Open source engages the engine alone.
            Professional engagement stacks all three.
          </p>
        </div>

        <div className="row">
          {ECOSYSTEM_ENTITIES.map(entity => (
            <div key={entity.name} className="col col--4">
              <div style={{
                padding: '2rem',
                border: '1px solid var(--uapk-border)',
                borderRadius: 12,
                height: '100%',
                display: 'flex',
                flexDirection: 'column' as const,
                background: 'var(--uapk-surface-elevated)',
                transition: 'box-shadow 0.2s ease',
              }}>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--ifm-color-primary)',
                  marginBottom: '0.5rem',
                }}>
                  {entity.label}
                </div>
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--uapk-text-primary)',
                  marginBottom: '0.75rem',
                }}>
                  {entity.name}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  color: 'var(--uapk-text-secondary)',
                  flex: 1,
                  marginBottom: '1.5rem',
                }}>
                  {entity.desc}
                </p>
                <Link
                  to={entity.href}
                  style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ifm-color-primary)' }}
                >
                  {entity.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── The Distinction ───────────────────────────────────────────────────────────

const SELF_HOSTED_POINTS = [
  'You configure the manifests',
  'You interpret what each regulation requires for your system',
  'UAPK enforces whatever you wrote',
  'Compliance posture is your decision',
  'Full transparency — you own every choice',
];

const PROFESSIONAL_POINTS = [
  'Manifests designed by a Rechtsanwalt with 12 years PQE',
  'Framework mappings reflect active legal interpretation — not spec reading',
  'Your governance report is a document designed by counsel',
  'BAFin-certified AI expertise covering the jurisdictions you operate in',
  'Lawkraft implements; Hucke & Sanker reviews the compliance posture',
];

function GovernanceDistinction() {
  return (
    <section style={{
      padding: '5rem 0',
      background: 'var(--uapk-surface-subtle)',
      borderTop: '1px solid var(--uapk-border)',
    }}>
      <div className="container">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            color: 'var(--ifm-color-primary)',
            marginBottom: '1.25rem',
          }}>
            The Distinction
          </div>

          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            color: 'var(--uapk-text-primary)',
          }}>
            What professional governance means
          </h2>

          <p style={{
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: 'var(--uapk-text-secondary)',
            marginBottom: '2.5rem',
          }}>
            The open-source version of UAPK is complete, fully functional, and the right
            choice for technical teams with in-house legal and compliance capability.
            Nothing is held back. Professional engagement is a different category of thing.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}>
            {/* Self-hosted column */}
            <div style={{
              padding: '1.75rem',
              border: '1px solid var(--uapk-border)',
              borderTop: '3px solid var(--uapk-border)',
              borderRadius: 10,
              background: 'var(--uapk-surface-elevated)',
            }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
                color: 'var(--uapk-text-secondary)',
                marginBottom: '1.25rem',
              }}>
                Self-hosted
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {SELF_HOSTED_POINTS.map(item => (
                  <li key={item} style={{
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                    color: 'var(--uapk-text-secondary)',
                    padding: '0.3rem 0',
                    display: 'flex',
                    gap: '0.6rem',
                    alignItems: 'flex-start',
                  }}>
                    <span style={{ color: 'var(--uapk-border)', flexShrink: 0, fontWeight: 700 }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional column */}
            <div style={{
              padding: '1.75rem',
              border: '1px solid var(--ifm-color-primary)',
              borderTop: '3px solid var(--ifm-color-primary)',
              borderRadius: 10,
              background: 'var(--uapk-surface-elevated)',
            }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
                color: 'var(--ifm-color-primary)',
                marginBottom: '1.25rem',
              }}>
                Professional engagement
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {PROFESSIONAL_POINTS.map(item => (
                  <li key={item} style={{
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                    color: 'var(--uapk-text-secondary)',
                    padding: '0.3rem 0',
                    display: 'flex',
                    gap: '0.6rem',
                    alignItems: 'flex-start',
                  }}>
                    <span style={{ color: 'var(--ifm-color-primary)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <blockquote style={{
            fontFamily: 'var(--uapk-font-serif)',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            color: 'var(--uapk-text-primary)',
            borderLeft: '3px solid var(--ifm-color-primary)',
            paddingLeft: '1.25rem',
            margin: 0,
            lineHeight: 1.7,
          }}>
            "The open-source tool enforces your policy. Professional engagement means your
            policy was written by a lawyer."
          </blockquote>
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────

function AboutCTA() {
  return (
    <section style={{
      padding: '5rem 0',
      textAlign: 'center',
      borderTop: '1px solid var(--uapk-border)',
    }}>
      <div className="container">
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
          color: 'var(--uapk-text-primary)',
        }}>
          Talk about your use case
        </h2>
        <p style={{
          fontFamily: 'var(--uapk-font-serif)',
          fontStyle: 'italic',
          fontSize: '1.05rem',
          color: 'var(--uapk-text-secondary)',
          maxWidth: 500,
          margin: '0 auto 2.5rem',
          lineHeight: 1.6,
        }}>
          Whether you are self-hosting or evaluating a professional engagement —
          a 45-minute governance assessment is free, no purchase required.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' as const }}>
          <Link className="button button--primary button--lg" to="/docs/contact">
            Request Governance Assessment
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/quickstart">
            Self-host for Free
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export default function About(): ReactNode {
  return (
    <Layout
      title="About — David Sanker & UAPK"
      description="UAPK was built by David Sanker — Rechtsanwalt, NY foreign counsel, and AI engineer with 12 years PQE in capital markets, IP, and AI regulatory strategy."
    >
      <AboutHero />
      <main>
        <OriginStory />
        <ProfileSection />
        <EcosystemSection />
        <GovernanceDistinction />
        <AboutCTA />
      </main>
    </Layout>
  );
}
