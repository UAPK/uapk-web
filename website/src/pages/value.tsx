import {useState} from 'react';
import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

const NUM = new Intl.NumberFormat('en-US');
const EUR = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const N_STUFEN = [
  {value: 1, label: 'Little or no value', hint: 'The result did not move the needle for the client.'},
  {value: 5, label: 'Solid, useful result', hint: 'Good utility — what a competent engagement should deliver.'},
  {value: 10, label: 'Exceptional result', hint: 'Not achievable without this specialized setup.'},
];

function ValueHero() {
  return (
    <section style={{
      padding: '5rem 0 3.5rem',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(79,70,229,0.06) 0%, transparent 70%)',
      textAlign: 'center',
    }}>
      <div className="container">
        <div style={{
          display: 'inline-block',
          padding: '0.35rem 1rem',
          borderRadius: 999,
          border: '1px solid var(--ifm-color-primary)',
          color: 'var(--ifm-color-primary)',
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}>UAPK Value</div>
        <h1 style={{
          fontSize: '2.6rem',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          color: 'var(--uapk-text-primary)',
          maxWidth: 760,
          margin: '0 auto 1.25rem',
        }}>The billable hour is dead.</h1>
        <p style={{
          fontSize: '1.2rem',
          lineHeight: 1.6,
          color: 'var(--uapk-text-secondary)',
          maxWidth: 680,
          margin: '0 auto',
        }}>
          AI does the work in minutes that used to take associate hours. Pricing that work
          by the hour punishes efficiency and hides value. <strong>UAPK Value</strong> prices
          AI-delivered advisory work by what it is worth — fully transparent, outcome-linked,
          and expertise-priced:
        </p>
        <p style={{
          fontFamily: 'var(--ifm-font-family-monospace)',
          fontSize: '1.35rem',
          fontWeight: 600,
          color: 'var(--ifm-color-primary)',
          margin: '1.75rem auto 0',
        }}>
          Fee = Value&nbsp;Units × €1 × Utility × Expertise
        </p>
      </div>
    </section>
  );
}

function Calculator() {
  const [tokens, setTokens] = useState(2000000);
  const [n, setN] = useState(5);
  const [mode, setMode] = useState<'friend' | 'formula'>('friend');
  const [years, setYears] = useState(3);
  const [spec, setSpec] = useState(1);
  const [academic, setAcademic] = useState(1);
  const [goodwill, setGoodwill] = useState(1);

  const vu = tokens / 10000;
  const e = mode === 'friend'
    ? 1
    : Math.max(2, (1 + 0.35 * years) * spec * academic * goodwill);
  const fee = vu * n * e;

  const cardStyle = (active: boolean): React.CSSProperties => ({
    flex: '1 1 150px',
    padding: '1rem 1.1rem',
    borderRadius: 12,
    border: `2px solid ${active ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-300)'}`,
    background: active ? 'rgba(79,70,229,0.05)' : 'transparent',
    cursor: 'pointer',
    textAlign: 'left' as const,
  });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.6rem 0.8rem',
    borderRadius: 8,
    border: '1px solid var(--ifm-color-emphasis-400)',
    background: 'var(--ifm-background-color)',
    color: 'var(--uapk-text-primary)',
    fontSize: '1rem',
  };

  return (
    <section style={{padding: '1rem 0 4rem'}}>
      <div className="container">
        <div style={{maxWidth: 860, margin: '0 auto'}}>
          <h2 style={{fontSize: '1.8rem', letterSpacing: '-0.02em', marginBottom: '0.5rem'}}>
            Try the formula
          </h2>
          <p style={{color: 'var(--uapk-text-secondary)', marginBottom: '2rem'}}>
            1 Value Unit = 10,000 tokens of task processing. Base price: €1 per unit —
            covering the specialized setup, quality assurance, liability and warranty,
            not raw compute.
          </p>

          {/* Token input */}
          <label style={{display: 'block', fontWeight: 600, marginBottom: '0.5rem'}}>
            Tokens consumed
          </label>
          <input
            type="range"
            min={0}
            max={10000000}
            step={10000}
            value={tokens}
            onChange={(ev) => setTokens(Number(ev.target.value))}
            style={{width: '100%', marginBottom: '0.75rem'}}
          />
          <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '2rem'}}>
            <input
              type="number"
              min={0}
              step={10000}
              value={tokens}
              onChange={(ev) => setTokens(Math.max(0, Number(ev.target.value)))}
              style={{...inputStyle, maxWidth: 220}}
            />
            <span style={{color: 'var(--uapk-text-secondary)'}}>
              = <strong>{NUM.format(Math.round(vu))}</strong> Value Units
            </span>
          </div>

          {/* Utility factor */}
          <label style={{display: 'block', fontWeight: 600, marginBottom: '0.5rem'}}>
            Utility factor <span style={{fontWeight: 400, color: 'var(--uapk-text-secondary)'}}>
              (N — proposed with rationale, agreed with the client)
            </span>
          </label>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem'}}>
            {N_STUFEN.map((stufe) => (
              <button
                key={stufe.value}
                type="button"
                style={cardStyle(n === stufe.value)}
                onClick={() => setN(stufe.value)}
              >
                <div style={{fontSize: '1.6rem', fontWeight: 700, color: 'var(--ifm-color-primary)'}}>
                  ×{stufe.value}
                </div>
                <div style={{fontWeight: 600, marginTop: '0.25rem'}}>{stufe.label}</div>
                <div style={{fontSize: '0.85rem', color: 'var(--uapk-text-secondary)', marginTop: '0.25rem'}}>
                  {stufe.hint}
                </div>
              </button>
            ))}
          </div>

          {/* Expertise factor */}
          <label style={{display: 'block', fontWeight: 600, marginBottom: '0.5rem'}}>
            Expertise factor <span style={{fontWeight: 400, color: 'var(--uapk-text-secondary)'}}>
              (E — never self-declared: published formula or friendship rate)
            </span>
          </label>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem'}}>
            <button type="button" style={cardStyle(mode === 'friend')} onClick={() => setMode('friend')}>
              <div style={{fontSize: '1.6rem', fontWeight: 700, color: 'var(--ifm-color-primary)'}}>×1</div>
              <div style={{fontWeight: 600, marginTop: '0.25rem'}}>Friendship rate</div>
              <div style={{fontSize: '0.85rem', color: 'var(--uapk-text-secondary)', marginTop: '0.25rem'}}>
                No professional fee factor on top — the deal between friends.
              </div>
            </button>
            <button type="button" style={cardStyle(mode === 'formula')} onClick={() => setMode('formula')}>
              <div style={{fontSize: '1.6rem', fontWeight: 700, color: 'var(--ifm-color-primary)'}}>
                ×{e.toFixed(2)}
              </div>
              <div style={{fontWeight: 600, marginTop: '0.25rem'}}>Published CV formula</div>
              <div style={{fontSize: '0.85rem', color: 'var(--uapk-text-secondary)', marginTop: '0.25rem'}}>
                Years × specialization × academics × market goodwill.
              </div>
            </button>
          </div>

          {mode === 'formula' && (
            <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '1.25rem',
              padding: '1.25rem',
              borderRadius: 12,
              border: '1px solid var(--ifm-color-emphasis-300)',
              marginBottom: '0.75rem',
            }}>
              <div>
                <label style={{fontWeight: 600, display: 'block', marginBottom: '0.35rem'}}>
                  Years post-qualification
                </label>
                <input type="range" min={0} max={30} value={years}
                  onChange={(ev) => setYears(Number(ev.target.value))} style={{width: '100%'}} />
                <div style={{fontSize: '0.9rem', color: 'var(--uapk-text-secondary)'}}>
                  {years} yrs → factor {(1 + 0.35 * years).toFixed(2)}
                </div>
              </div>
              <div>
                <label style={{fontWeight: 600, display: 'block', marginBottom: '0.35rem'}}>
                  Specialization
                </label>
                <select value={spec} onChange={(ev) => setSpec(Number(ev.target.value))} style={inputStyle}>
                  <option value={1}>Generalist (×1)</option>
                  <option value={3}>Focused (×3)</option>
                  <option value={8}>Rare &amp; in demand (×8)</option>
                </select>
              </div>
              <div>
                <label style={{fontWeight: 600, display: 'block', marginBottom: '0.35rem'}}>
                  Academic specialization
                </label>
                <select value={academic} onChange={(ev) => setAcademic(Number(ev.target.value))} style={inputStyle}>
                  <option value={1}>None (×1)</option>
                  <option value={1.5}>Advanced degree (×1.5)</option>
                  <option value={2.5}>PhD / Professor (×2.5)</option>
                </select>
              </div>
              <div>
                <label style={{fontWeight: 600, display: 'block', marginBottom: '0.35rem'}}>
                  Market goodwill
                </label>
                <input type="range" min={1} max={5} value={goodwill}
                  onChange={(ev) => setGoodwill(Number(ev.target.value))} style={{width: '100%'}} />
                <div style={{fontSize: '0.9rem', color: 'var(--uapk-text-secondary)'}}>
                  {goodwill} — from market data, not self-report
                </div>
              </div>
            </div>
            <p style={{fontSize: '0.85rem', color: 'var(--uapk-text-secondary)', margin: '0 0 2rem'}}>
              E is floored at 2 for regular clients — the friendship rate is the only exception.
            </p>
            </>
          )}

          {/* Result */}
          <div style={{
            padding: '1.75rem 2rem',
            borderRadius: 12,
            background: 'var(--ifm-color-primary)',
            color: 'white',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85}}>
                {NUM.format(Math.round(vu))} Value Units × €1 × N={n} × E={e.toFixed(2)}
              </div>
              <div style={{fontSize: '2.4rem', fontWeight: 700, letterSpacing: '-0.02em', marginTop: '0.25rem'}}>
                {EUR.format(fee)}
              </div>
            </div>
            <div style={{fontSize: '0.9rem', opacity: 0.85, maxWidth: 320}}>
              Every input is documented: per-step token ledger, utility rating with
              rationale, published expertise formula. No black box.
            </div>
          </div>
          <p style={{fontSize: '0.85rem', color: 'var(--uapk-text-secondary)', marginTop: '0.75rem'}}>
            Worked example: 2,000,000 tokens = 200 Value Units; solid utility (N=5),
            friendship rate (E=1) → €1,000.
          </p>
        </div>
      </div>
    </section>
  );
}

function ValueWhy() {
  const items = [
    {
      title: 'Outcome over hours',
      text: 'When AI compresses hours of research into minutes, the hour measures nothing. ' +
        'The utility factor prices what the client actually received — including a genuine ' +
        'success component the market asks for.',
    },
    {
      title: 'Radical transparency',
      text: 'A per-step token ledger accompanies every invoice. Each factor is documented: ' +
        'tokens measured, utility proposed with rationale, expertise from a published ' +
        'formula. Clients can check everything.',
    },
    {
      title: 'Efficiency is rewarded, not punished',
      text: 'A pre-agreed token budget caps verbosity gaming — more tokens without more ' +
        'value earn nothing. The better your setup, the sharper your price-performance.',
    },
  ];
  return (
    <section style={{padding: '2rem 0 4rem', background: 'rgba(79,70,229,0.03)'}}>
      <div className="container">
        <h2 style={{fontSize: '1.8rem', letterSpacing: '-0.02em', textAlign: 'center', marginBottom: '2.5rem'}}>
          Why a new pricing model
        </h2>
        <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center'}}>
          {items.map((item) => (
            <div key={item.title} style={{flex: '1 1 260px', maxWidth: 360}}>
              <h3 style={{fontSize: '1.15rem', marginBottom: '0.5rem'}}>{item.title}</h3>
              <p style={{color: 'var(--uapk-text-secondary)', lineHeight: 1.65}}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueFactors() {
  const rows = [
    ['Value Units (U)', 'Tokens of task processing ÷ 10,000 — measured at the model, per work step.'],
    ['Unit price (P)', '€1 per Value Unit. Prices the specialized setup, QA, liability and warranty — not raw compute.'],
    ['Utility (N)', '1 / 5 / 10 — proposed with written rationale, agreed with the client; provisional settlement at N=5 pending agreement.'],
    ['Expertise (E)', 'Friendship rate: 1. Otherwise a published formula from verifiable CV components — never self-declared.'],
  ];
  return (
    <section style={{padding: '2rem 0 4rem'}}>
      <div className="container" style={{maxWidth: 860}}>
        <h2 style={{fontSize: '1.8rem', letterSpacing: '-0.02em', marginBottom: '1.5rem'}}>
          The four factors
        </h2>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <tbody>
            {rows.map(([factor, text]) => (
              <tr key={factor} style={{borderBottom: '1px solid var(--ifm-color-emphasis-200)'}}>
                <td style={{padding: '0.85rem 1rem 0.85rem 0', fontWeight: 600, whiteSpace: 'nowrap', width: 170}}>
                  {factor}
                </td>
                <td style={{padding: '0.85rem 0', color: 'var(--uapk-text-secondary)', lineHeight: 1.6}}>
                  {text}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{color: 'var(--uapk-text-secondary)', marginTop: '1.5rem', lineHeight: 1.65}}>
          Guardrails built in: a token budget agreed before work starts; a periodic
          capability benchmark documenting what standard tools achieve on the same task
          types (client prompts are never replayed to third-party models without explicit
          consent); a voluntary client top-up that sets no precedent; and an independent
          expert arbitration step for disputes. Court-related mandates remain under the
          German RVG. Value Units are a pure accounting unit — no crypto token, no
          blockchain involved.
        </p>
      </div>
    </section>
  );
}

function ValueCta() {
  return (
    <section style={{padding: '2rem 0 5rem', background: 'rgba(79,70,229,0.03)'}}>
      <div className="container" style={{textAlign: 'center', maxWidth: 720}}>
        <h2 style={{fontSize: '1.8rem', letterSpacing: '-0.02em', marginBottom: '1rem'}}>
          Adopt the standard
        </h2>
        <p style={{color: 'var(--uapk-text-secondary)', lineHeight: 1.65, marginBottom: '2rem'}}>
          The full contract module is public — take it into your own engagements, adapt it,
          or price your next AI-delivered mandate on it. UAPK Value is the settlement
          layer of the UAPK stack: it makes the value of governed AI work measurable —
          token by token, outcome by outcome.
        </p>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link className="button button--primary button--lg" to="/docs/business/value-standard">
            Read the standard
          </Link>
          <a className="button button--secondary button--lg" href="mailto:mail@uapk.info?subject=UAPK%20Value">
            Talk to us
          </a>
        </div>
      </div>
    </section>
  );
}

export default function ValuePage(): ReactNode {
  return (
    <Layout
      title="UAPK Value — Pricing after the billable hour"
      description="Transparent, outcome-linked pricing for AI-delivered advisory work: Value Units × €1 × Utility × Expertise. Interactive calculator and public standard."
    >
      <ValueHero />
      <Calculator />
      <ValueWhy />
      <ValueFactors />
      <ValueCta />
    </Layout>
  );
}
