import React, { useState } from 'react';

const BACKEND         = import.meta.env.VITE_BACKEND_URL       || 'http://noeta-backend-prod.eba-3bts6smd.ap-south-1.elasticbeanstalk.com';
const SUPER_ADMIN_URL = import.meta.env.VITE_SUPER_ADMIN_URL   || 'http://noeta-super-admin-app.s3-website.ap-south-1.amazonaws.com';
const PARTNER_URL     = import.meta.env.VITE_PARTNER_URL       || 'http://noeta-partner-portal-app.s3-website.ap-south-1.amazonaws.com';
const CLIENT_URL      = import.meta.env.VITE_CLIENT_ADMIN_URL  || 'http://noeta-client-admin-app.s3-website.ap-south-1.amazonaws.com';

export default function LoginModal({ onClose }) {
  const [step,    setStep]    = useState('choose'); // choose | business | loading | notfound
  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleBusinessLogin(e) {
    e.preventDefault();
    if (!email.trim().includes('@')) { setError('Enter a valid email address'); return; }
    setLoading(true); setError('');
    try {
      const res  = await fetch(`${BACKEND}/api/public/login-redirect?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (data.dashboard_url) {
        window.location.href = data.dashboard_url;
      } else {
        setStep('notfound');
      }
    } catch {
      setError('Could not reach server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const PORTAL_OPTIONS = [
    {
      icon: '🛡️',
      label: 'Super Admin',
      sub: 'Manage all businesses, clients & billing',
      gradient: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
      hoverColor: '#7c3aed',
      href: SUPER_ADMIN_URL,
    },
    {
      icon: '🤝',
      label: 'Affiliate Partner',
      sub: 'Manage your client accounts & approvals',
      gradient: 'linear-gradient(135deg,#0f766e,#0d9488)',
      hoverColor: '#0f766e',
      href: PARTNER_URL,
    },
    {
      icon: '💼',
      label: 'Business Owner',
      sub: 'Login to your Noeta dashboard',
      gradient: 'linear-gradient(135deg,#25d366,#128c7e)',
      hoverColor: '#25d366',
      onClick: () => setStep('business'),
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-body" style={{ paddingTop: 32 }}>

          {/* STEP 1 — Choose portal */}
          {step === 'choose' && (
            <>
              <div className="modal-title">Welcome back 👋</div>
              <div className="modal-sub" style={{ marginBottom: 20 }}>Select your login type to continue</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PORTAL_OPTIONS.map(opt => {
                  const inner = (
                    <div
                      style={{
                        border: '2px solid var(--border)', borderRadius: 14, padding: '16px 20px',
                        cursor: 'pointer', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 14,
                        background: 'var(--card)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = opt.hoverColor; e.currentTarget.style.background = `${opt.hoverColor}08`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card)'; }}
                      onClick={opt.onClick}
                    >
                      <div style={{
                        width: 46, height: 46, background: opt.gradient,
                        borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, flexShrink: 0,
                      }}>
                        {opt.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 15 }}>{opt.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--sub)', marginTop: 2 }}>{opt.sub}</div>
                      </div>
                      <div style={{ color: 'var(--sub)', fontSize: 18 }}>→</div>
                    </div>
                  );

                  return opt.href ? (
                    <a key={opt.label} href={opt.href} rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }} onClick={onClose}>
                      {inner}
                    </a>
                  ) : (
                    <div key={opt.label}>{inner}</div>
                  );
                })}
              </div>

              <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--sub)' }}>
                Don't have an account?{' '}
                <button style={{ background: 'none', border: 'none', color: 'var(--acc)', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
                  onClick={onClose}>Sign up free →</button>
              </div>
            </>
          )}

          {/* STEP 2 — Business email lookup */}
          {step === 'business' && (
            <>
              <button onClick={() => { setStep('choose'); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--sub)', cursor: 'pointer', fontSize: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                ← Back
              </button>
              <div className="modal-title">Business Login</div>
              <div className="modal-sub">Enter your registered email — we'll find your dashboard instantly.</div>

              <form onSubmit={handleBusinessLogin} style={{ marginTop: 16 }}>
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <input className="form-input" type="email" placeholder="you@yourbusiness.com"
                    value={email} onChange={e => setEmail(e.target.value)} autoFocus />
                </div>
                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#dc2626' }}>
                    ⚠️ {error}
                  </div>
                )}
                <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 4 }} disabled={loading}>
                  {loading ? 'Finding your dashboard…' : 'Go to my dashboard →'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: 'var(--sub)', lineHeight: 1.7 }}>
                🔒 Your email finds your private dashboard.<br />
                You'll enter your password there.
              </div>

              {/* Direct link fallback */}
              <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--surf2)', borderRadius: 10, fontSize: 12, color: 'var(--sub)', textAlign: 'center' }}>
                Know your dashboard?{' '}
                <a href={CLIENT_URL} rel="noopener noreferrer" style={{ color: 'var(--acc)', fontWeight: 700 }}>
                  Go directly →
                </a>
              </div>
            </>
          )}

          {/* Not found */}
          {step === 'notfound' && (
            <div style={{ textAlign: 'center', paddingTop: 12 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🤔</div>
              <div className="modal-title">No account found</div>
              <p style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.7, marginBottom: 24 }}>
                We couldn't find a Noeta account for <strong>{email}</strong>.<br /><br />
                If you just signed up, check your email for your dashboard link — sent automatically after payment.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }}
                  onClick={() => { setStep('business'); setError(''); }}>
                  Try a different email
                </button>
                <a href={CLIENT_URL} className="btn btn-ghost w-full" style={{ justifyContent: 'center', textDecoration: 'none' }}>
                  Go to login page directly →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
