import type {ReactNode} from 'react';
import Layout from '@theme/Layout';

const EFFECTIVE_DATE = 'March 25, 2026';
const CONTACT_EMAIL = 'mail@uapk.info';

function Section({id, title, children}: {id: string; title: string; children: ReactNode}) {
  return (
    <section id={id} style={{marginBottom: '2.5rem'}}>
      <h2 style={{borderBottom: '1px solid var(--ifm-color-emphasis-300)', paddingBottom: '0.5rem'}}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function IntegrationCard({name, slug, children}: {name: string; slug: string; children: ReactNode}) {
  return (
    <div
      id={`integration-${slug}`}
      style={{
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: '8px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.25rem',
        backgroundColor: 'var(--ifm-card-background-color)',
      }}
    >
      <h3 style={{marginTop: 0}}>{name}</h3>
      {children}
    </div>
  );
}

export default function PrivacyPolicy(): ReactNode {
  return (
    <Layout
      title="Privacy Policy"
      description="UAPK Gateway Privacy Policy — covering data handling for all integration platforms including Zapier, Make.com, n8n, and Langflow."
    >
      <main className="container margin-vert--xl" style={{maxWidth: '860px'}}>
        <h1>Privacy Policy</h1>
        <p style={{color: 'var(--ifm-color-emphasis-600)', marginBottom: '2rem'}}>
          Effective date: {EFFECTIVE_DATE} &nbsp;·&nbsp; Contact:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>

        <Section id="overview" title="1. Overview">
          <p>
            UAPK Gateway ("we", "us", or "our") is a policy enforcement and audit platform for
            AI agents. This Privacy Policy explains what data we collect, how we use it, and what
            rights you have, whether you access UAPK Gateway directly through our API, via our
            hosted service at <strong>api.uapk.info</strong>, or through a third-party integration
            platform (Zapier, Make.com, n8n, or Langflow).
          </p>
          <p>
            By using UAPK Gateway or any of its integration connectors, you agree to the practices
            described in this policy. If you are using UAPK Gateway on behalf of an organization,
            you represent that you have authority to bind that organization to this policy.
          </p>
        </Section>

        <Section id="data-collected" title="2. Data We Collect">
          <h3>2.1 Account &amp; Authentication Data</h3>
          <ul>
            <li>Email address and password hash (bcrypt) for user accounts</li>
            <li>Organization name and UUID</li>
            <li>API keys (stored as bcrypt hashes — the plaintext is shown once at creation)</li>
            <li>JWT session tokens (short-lived, not persisted)</li>
          </ul>

          <h3>2.2 Agent Interaction Data</h3>
          <p>
            Every request to <code>/evaluate</code> or <code>/execute</code> generates an
            interaction record containing:
          </p>
          <ul>
            <li>UAPK ID and agent ID</li>
            <li>Action type, tool name, and parameters</li>
            <li>Policy decision (allow / deny / escalate) and reason codes</li>
            <li>Counterparty metadata (if supplied)</li>
            <li>Timestamps, request/result hashes, and an Ed25519 gateway signature</li>
            <li>The SHA-256 hash of the previous record (hash chain for tamper evidence)</li>
          </ul>
          <p>
            These records are <strong>append-only and cannot be deleted</strong>. This is by design:
            the hash chain guarantees audit log integrity. Records exported to S3 are locked under
            AWS Object Lock COMPLIANCE mode with a 7-year retention period.
          </p>

          <h3>2.3 Approval Workflow Data</h3>
          <ul>
            <li>Approval requests including action metadata and escalation reason</li>
            <li>Reviewer identity, decision, notes, and timestamp</li>
            <li>Override token lifecycle (issued, consumed, expired)</li>
          </ul>

          <h3>2.4 Usage &amp; Technical Data</h3>
          <ul>
            <li>API request logs (endpoint, status code, latency)</li>
            <li>Rate limit counters and daily action budgets (per organization)</li>
            <li>Billing events via Stripe (we do not store card numbers)</li>
          </ul>
        </Section>

        <Section id="data-use" title="3. How We Use Your Data">
          <ul>
            <li><strong>Policy enforcement:</strong> evaluating agent action requests against your configured rules in real time</li>
            <li><strong>Audit logging:</strong> building a tamper-evident, cryptographically signed record of every agent action for compliance and forensics</li>
            <li><strong>Human approval workflows:</strong> routing escalated actions to reviewers and managing the override token lifecycle</li>
            <li><strong>Service operation:</strong> authentication, rate limiting, billing, and system health monitoring</li>
            <li><strong>Security:</strong> detecting abuse, investigating incidents, and enforcing SSRF/injection protections</li>
          </ul>
          <p>We do not sell, rent, or share your data with third parties for marketing purposes.</p>
        </Section>

        <Section id="data-retention" title="4. Data Retention">
          <p>
            Interaction records are retained indefinitely as part of the tamper-evident audit chain.
            Exported evidence bundles stored in S3 are subject to 7-year Object Lock retention.
            Account data and approval records are retained for the duration of your subscription
            plus 90 days after cancellation. You may request deletion of account data by contacting
            us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> — audit records will
            remain as required by the immutability guarantee.
          </p>
        </Section>

        <Section id="integrations" title="5. Third-Party Integration Platforms">
          <p>
            UAPK Gateway provides connectors for the following automation and AI pipeline platforms.
            When you use these connectors, data flows between that platform and the UAPK Gateway API.
            The platform's own privacy policy applies to data stored or processed within that platform.
          </p>

          <IntegrationCard name="Zapier" slug="zapier">
            <p>
              The UAPK Gateway Zapier integration (App ID: 238403) allows you to call{' '}
              <strong>Evaluate Action</strong>, <strong>Execute Action</strong>,{' '}
              <strong>Approve Action</strong>, and <strong>Deny Action</strong> from Zapier Zaps,
              and to search approvals and audit records.
            </p>
            <p><strong>Data sent to UAPK Gateway by this integration:</strong></p>
            <ul>
              <li>Your UAPK API key and Organization ID (stored as Zapier connection credentials — encrypted at rest by Zapier)</li>
              <li>Agent action payloads you pass into the Zap (UAPK ID, agent ID, action type, tool, parameters)</li>
              <li>Approval IDs and reviewer decisions when using Approve/Deny actions</li>
            </ul>
            <p><strong>Data returned to Zapier from UAPK Gateway:</strong></p>
            <ul>
              <li>Policy decisions, interaction IDs, reason codes</li>
              <li>Override tokens (single-use, short-lived)</li>
              <li>Approval records and audit record summaries</li>
            </ul>
            <p>
              Zapier's privacy policy applies to credential storage and Zap execution logs:{' '}
              <a href="https://zapier.com/privacy" target="_blank" rel="noopener noreferrer">
                zapier.com/privacy
              </a>
            </p>
          </IntegrationCard>

          <IntegrationCard name="Make.com (formerly Integromat)" slug="make">
            <p>
              The UAPK Gateway Make.com app allows you to incorporate policy enforcement and
              human approval steps into Make scenarios using modules for evaluate, execute,
              approve, deny, and audit chain verification.
            </p>
            <p><strong>Data sent to UAPK Gateway by this integration:</strong></p>
            <ul>
              <li>Your API key and Organization ID (stored as a Make connection — encrypted by Make)</li>
              <li>Action payloads defined in your scenario modules</li>
              <li>Approval decisions including reviewer notes</li>
            </ul>
            <p><strong>Data returned to Make from UAPK Gateway:</strong></p>
            <ul>
              <li>Policy decisions and audit metadata</li>
              <li>Approval status and override tokens</li>
              <li>Audit chain verification results</li>
            </ul>
            <p>
              Make.com's privacy policy:{' '}
              <a href="https://www.make.com/en/privacy-notice" target="_blank" rel="noopener noreferrer">
                make.com/en/privacy-notice
              </a>
            </p>
          </IntegrationCard>

          <IntegrationCard name="n8n" slug="n8n">
            <p>
              The UAPK Gateway n8n community node (<code>n8n-nodes-uapk-gateway</code>) can be
              installed in self-hosted or cloud n8n instances. It provides node resources for
              Gateway (evaluate/execute) and Approvals (list, get, approve, deny).
            </p>
            <p><strong>Data sent to UAPK Gateway by this integration:</strong></p>
            <ul>
              <li>Your API key and Management Token (stored in n8n credentials — encrypted by n8n)</li>
              <li>Action payloads you configure in the node</li>
            </ul>
            <p><strong>Self-hosted note:</strong> If you run n8n on your own infrastructure,
            the n8n credential store is under your control. UAPK Gateway only receives the data
            you explicitly send via node executions.
            </p>
            <p>
              n8n's privacy policy:{' '}
              <a href="https://n8n.io/legal/privacy" target="_blank" rel="noopener noreferrer">
                n8n.io/legal/privacy
              </a>
            </p>
          </IntegrationCard>

          <IntegrationCard name="Langflow" slug="langflow">
            <p>
              The <code>uapk-langflow</code> Python package adds two visual components to
              Langflow — <strong>UAPK Evaluate</strong> and <strong>UAPK Execute</strong> —
              that can be dropped into AI pipeline flows. The package is installed via pip
              and registers automatically via the <code>langflow.components</code> entry point.
            </p>
            <p><strong>Data sent to UAPK Gateway by this integration:</strong></p>
            <ul>
              <li>Your API key and Gateway URL (configured in the component — stored in your Langflow instance)</li>
              <li>Agent action data flowing through the pipeline at runtime</li>
            </ul>
            <p><strong>Self-hosted note:</strong> Langflow is typically self-hosted; all credential
            storage is local to your deployment. UAPK Gateway receives only the action data
            passed to the component during flow execution.
            </p>
            <p>
              Langflow's privacy policy:{' '}
              <a href="https://www.langflow.org/privacy-policy" target="_blank" rel="noopener noreferrer">
                langflow.org/privacy-policy
              </a>
            </p>
          </IntegrationCard>
        </Section>

        <Section id="security" title="6. Security">
          <p>We implement the following technical measures to protect your data:</p>
          <ul>
            <li><strong>Encryption in transit:</strong> TLS 1.2+ on all API endpoints</li>
            <li><strong>Credential encryption:</strong> Fernet (AES-128-CBC + HMAC-SHA256) for connector secrets; bcrypt for API keys and passwords</li>
            <li><strong>Signature integrity:</strong> Ed25519 signatures on every interaction record</li>
            <li><strong>SSRF protection:</strong> all connector webhook URLs are validated against an allowlist</li>
            <li><strong>Token security:</strong> capability and override tokens include a <code>token_type</code> field to prevent substitution attacks</li>
          </ul>
          <p>
            To report a security vulnerability, email{' '}
            <a href="mailto:security@uapk.info">security@uapk.info</a> or see our{' '}
            <a href="/docs/security">Security Policy</a>.
          </p>
        </Section>

        <Section id="your-rights" title="7. Your Rights">
          <p>Depending on your jurisdiction, you may have rights to:</p>
          <ul>
            <li><strong>Access</strong> the personal data we hold about you</li>
            <li><strong>Correct</strong> inaccurate account data</li>
            <li><strong>Delete</strong> your account and non-audit personal data</li>
            <li><strong>Port</strong> your data in machine-readable format</li>
            <li><strong>Object</strong> to certain processing activities</li>
          </ul>
          <p>
            Note: interaction records in the audit chain cannot be deleted due to the
            immutability guarantee. This is a contractual and technical requirement of the service.
          </p>
          <p>
            To exercise any right, contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </Section>

        <Section id="gdpr" title="8. GDPR / EU Data Subjects">
          <p>
            UAPK Gateway is operated from the European Union. If you are an EU data subject,
            the legal basis for processing your data is:
          </p>
          <ul>
            <li><strong>Contract performance</strong> — processing necessary to deliver the Gateway service</li>
            <li><strong>Legitimate interests</strong> — security, fraud prevention, and audit integrity</li>
            <li><strong>Legal obligation</strong> — compliance with applicable laws</li>
          </ul>
          <p>
            You have the right to lodge a complaint with a supervisory authority. Our primary
            supervisory authority is the relevant data protection authority in Germany.
          </p>
        </Section>

        <Section id="cookies" title="9. Cookies &amp; Analytics">
          <p>
            The uapk.info documentation website uses Google Analytics 4 with IP anonymization
            enabled. No personally identifiable information is collected through analytics.
            The UAPK Gateway API itself does not use cookies.
          </p>
        </Section>

        <Section id="changes" title="10. Changes to This Policy">
          <p>
            We may update this policy from time to time. Material changes will be announced via
            email to registered users and noted on this page with a revised effective date.
            Continued use of the service after changes constitutes acceptance.
          </p>
        </Section>

        <Section id="contact" title="11. Contact">
          <p>
            UAPK Project<br />
            c/o Hucke &amp; Sanker<br />
            Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><br />
            Security: <a href="mailto:security@uapk.info">security@uapk.info</a>
          </p>
        </Section>

        <div
          style={{
            marginTop: '3rem',
            padding: '1rem 1.5rem',
            backgroundColor: 'var(--ifm-color-emphasis-100)',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: 'var(--ifm-color-emphasis-600)',
          }}
        >
          <strong>Quick links:</strong>{' '}
          <a href="#integration-zapier">Zapier</a> ·{' '}
          <a href="#integration-make">Make.com</a> ·{' '}
          <a href="#integration-n8n">n8n</a> ·{' '}
          <a href="#integration-langflow">Langflow</a> ·{' '}
          <a href="#security">Security</a> ·{' '}
          <a href="#gdpr">GDPR</a> ·{' '}
          <a href="#your-rights">Your Rights</a>
        </div>
      </main>
    </Layout>
  );
}
