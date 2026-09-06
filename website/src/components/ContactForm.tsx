import React, { useState, useEffect, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './ContactForm.module.css';

const API_URL = 'https://api.uapk.info/api/v1/leads';
const TURNSTILE_SITEKEY = '0x4AAAAAAC1ezjdzZTLGjJz2';

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, params: object) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    _uapkTurnstileToken?: string | null;
  }
}

function ContactFormInner(): JSX.Element {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    use_case: '',
    timeline: 'Immediate',
    budget: 'pilot',
    interest_type: 'pilot',
    source: 'uapk.info',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Load Turnstile script and render widget
  useEffect(() => {
    const scriptId = 'cf-turnstile-script';
    const renderWidget = () => {
      if (!turnstileRef.current || !window.turnstile) return;
      if (widgetIdRef.current) return; // already rendered
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITEKEY,
        theme: 'auto',
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(null),
        'error-callback': () => setTurnstileToken(null),
      });
    };

    if (document.getElementById(scriptId)) {
      // Script already loaded
      if (window.turnstile) renderWidget();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = renderWidget;
    document.head.appendChild(script);

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!turnstileToken) {
      setStatus('error');
      setErrorMsg('Please complete the security check below before submitting.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, turnstile_token: turnstileToken }),
      });

      if (response.status === 201) {
        setStatus('success');
        setFormData({ name: '', email: '', company: '', role: '', use_case: '', timeline: 'Immediate', budget: 'pilot', interest_type: 'pilot', source: 'uapk.info' });
        setTurnstileToken(null);
      } else if (response.status === 403) {
        setStatus('error');
        setErrorMsg('Security check failed. Please try again.');
        if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken(null);
      } else {
        const data = await response.json().catch(() => ({}));
        setStatus('error');
        setErrorMsg(data.detail ? String(data.detail) : 'Something went wrong. Please email mail@uapk.info directly.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again or email mail@uapk.info.');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon} />
        <h3>Request received.</h3>
        <p>We'll be in touch within 24 hours. Check your email for next steps.</p>
        <button onClick={() => setStatus('idle')} className={styles.resetButton}>
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Jane Smith" disabled={status === 'submitting'} />
        </div>
        <div className={styles.formGroup}>
          <label>Work email *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="jane@firm.com" disabled={status === 'submitting'} />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Company / Firm *</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} required placeholder="Acme Legal LLP" disabled={status === 'submitting'} />
        </div>
        <div className={styles.formGroup}>
          <label>Your role</label>
          <select name="role" value={formData.role} onChange={handleChange} disabled={status === 'submitting'}>
            <option value="">Select…</option>
            <option value="General Counsel">General Counsel</option>
            <option value="Compliance Officer">Compliance Officer</option>
            <option value="CTO">CTO / Engineering Lead</option>
            <option value="Partner">Partner (Law Firm)</option>
            <option value="CEO">CEO / Founder</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>What do you want to deploy? *</label>
        <textarea name="use_case" value={formData.use_case} onChange={handleChange} rows={3} required placeholder="e.g. Settlement negotiation agent for IP disputes — needs human approval above €50K and court-admissible logs" disabled={status === 'submitting'} />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Timeline</label>
          <select name="timeline" value={formData.timeline} onChange={handleChange} disabled={status === 'submitting'}>
            <option value="Immediate">This month</option>
            <option value="Next Quarter">Next quarter</option>
            <option value="Exploring">Just exploring</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>I'm looking for</label>
          <select name="budget" value={formData.budget} onChange={handleChange} disabled={status === 'submitting'}>
            <option value="assessment">Free governance assessment</option>
            <option value="blueprint">Blueprint — €5K–€10K</option>
            <option value="pilot">Agent Governance Pilot — €15K–€25K</option>
            <option value="enterprise">Enterprise support — €3K–€10K/mo</option>
            <option value="unsure">Not sure yet — let's talk</option>
          </select>
        </div>
      </div>

      {/* Turnstile */}
      <div className={styles.turnstileWrap}>
        <div ref={turnstileRef} />
      </div>

      {status === 'error' && (
        <div className={styles.errorMsg}>{errorMsg}</div>
      )}

      <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Get Expert Review →'}
      </button>

      <p className={styles.privacy}>
        No spam. Your information is never shared. Unsubscribe at any time.
      </p>
    </form>
  );
}

export default function ContactForm(): JSX.Element {
  return (
    <BrowserOnly fallback={<div style={{ height: 400 }} />}>
      {() => <ContactFormInner />}
    </BrowserOnly>
  );
}
