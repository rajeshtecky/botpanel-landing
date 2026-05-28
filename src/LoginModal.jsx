import React, { useState } from 'react';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'https://botpanel-backend.onrender.com';
const SUPER_ADMIN_URL = 'https://superadminbot.netlify.app';

export default function LoginModal({ onClose }) {
  const [step, setStep]     = useState('choose'); // choose | business | loading | notfound
  const [email, setEmail]   = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function handleBusinessLogin(e) {
    e.preventDefault();
    if (!email.trim().includes('@')) { setError('Enter a valid email address'); return; }
    setLoading(true);
    setError('');
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-body" style={{ paddingTop: 36 }}>

          {/* Step 1 — Choose who you are */}
          {step === 'choose' && (
            <>
              <div className="modal-title">Welcome back 👋</div>
              <div className="modal-sub">Who are you logging in as?</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                {/* Super Admin */}
                <a href={SUPER_ADMIN_URL} target="_blank" rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                  onClick={onClose}>
                  <div style={{
                    border: '2px solid var(--border)', borderRadius: 14, padding: '18px 22px',
                    cursor: 'pointer', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 16,
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#7c3aed'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <div style={{
                      width: 48, height: 48, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                      borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22, flexShrink: 0,
                    }}>🛡️</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>Super Admin</div>
                      <div style={{ fontSize: 13, color: 'var(--sub)', marginTop: 2 }}>Manage all businesses, clients & billing</div>
                    </div>
                    <div style={{ marginLeft: 'auto', color: 'var(--sub)', fontSize: 18 }}>→</div>
                  </div>
                </a>

                {/* Business Owner */}
                <div
                  style={{
                    border: '2px solid var(--border)', borderRadius: 14, padding: '18px 22px',
                    cursor: 'pointer', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 16,
                  }}
                  onClick={() => setStep('business')}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#25d366'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <div style={{
                    width: 48, height: 48, background: 'linear-gradient(135deg,#25d366,#128c7e)',
                    borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, flexShrink: 0,
                  }}>💼</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>Business Owner</div>
                    <div style={{ fontSize: 13, color: 'var(--sub)', marginTop: 2 }}>Login to your Noeta dashboard</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: 'var(--sub)', fontSize: 18 }}>→</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--sub)' }}>
                Don't have an account?{' '}
                <button style={{ background: 'none', border: 'none', color: 'var(--acc)', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
                  onClick={onClose}>
                  Sign up free →
                </button>
              </div>
            </>
          )}

          {/* Step 2 — Business email lookup */}
          {step === 'business' && (
            <>
              <button onClick={() => { setStep('choose'); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--sub)', cursor: 'pointer', fontSize: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                ← Back
              </button>
              <div className="modal-title">Business Login</div>
              <div className="modal-sub">Enter your registered email and we'll take you to your dashboard.</div>

              <form onSubmit={handleBusinessLogin}>
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

              <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--sub)', lineHeight: 1.7 }}>
                🔒 We use your email to find your private dashboard URL.<br />
                You'll enter your password on your own dashboard.
              </div>
            </>
          )}

          {/* Not found */}
          {step === 'notfound' && (
            <>
              <div style={{ textAlign: 'center', paddingTop: 12 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🤔</div>
                <div className="modal-title">No account found</div>
                <p style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.7, marginBottom: 24 }}>
                  We couldn't find a Noeta account for <strong>{email}</strong>.<br /><br />
                  If you just signed up, check your email for your dashboard link — it was sent to you automatically after payment.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }}
                    onClick={() => { setStep('business'); setError(''); }}>
                    Try a different email
                  </button>
                  <button className="btn btn-ghost w-full" style={{ justifyContent: 'center' }}
                    onClick={onClose}>
                    Sign up instead →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
