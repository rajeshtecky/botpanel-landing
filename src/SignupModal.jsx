import React, { useState } from 'react';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'https://botpanel-backend.onrender.com';

const BIZ_TYPES = [
  { value: 'ecommerce',  label: '🛍️ E-commerce / Corporate Gifts' },
  { value: 'restaurant', label: '🍽️ Restaurant / Food Delivery' },
  { value: 'salon',      label: '💇 Salon / Spa' },
  { value: 'clinic',     label: '🏥 Clinic / Hospital' },
  { value: 'realestate', label: '🏠 Real Estate' },
];

const COUNTRIES = [
  { value: 'IN', label: '🇮🇳 India' },
  { value: 'GB', label: '🇬🇧 United Kingdom' },
  { value: 'US', label: '🇺🇸 United States' },
  { value: 'AE', label: '🇦🇪 UAE' },
  { value: 'AU', label: '🇦🇺 Australia' },
  { value: 'OTHER', label: '🌍 Other' },
];

const CURRENCY_SYMBOL = { IN: '₹', GB: '£', US: '$', AE: 'AED ', AU: 'A$', OTHER: '$' };

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    prices: { IN: 2999, GB: 29, US: 35, AE: 129, AU: 55, OTHER: 35 },
    desc: '500 messages/mo · 20 products · 3 staff',
    badge: null,
  },
  {
    id: 'growth',
    name: 'Growth',
    prices: { IN: 5999, GB: 59, US: 69, AE: 249, AU: 109, OTHER: 69 },
    desc: '2,000 messages/mo · 100 products · 10 staff · Campaigns',
    badge: 'Most Popular',
  },
  {
    id: 'premium',
    name: 'Premium',
    prices: { IN: 11999, GB: 119, US: 139, AE: 499, AU: 219, OTHER: 139 },
    desc: '10,000 messages/mo · Unlimited · Priority support',
    badge: null,
  },
];

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function SignupModal({ onClose, defaultPlan }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    owner_name: '', email: '', phone: '', business_name: '',
    business_type: 'ecommerce', country: 'IN',
  });
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan || 'growth');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const country = form.country || 'IN';
  const sym = CURRENCY_SYMBOL[country] || '$';
  const plan = PLANS.find(p => p.id === selectedPlan);
  const price = plan?.prices[country] ?? plan?.prices['IN'];

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function step1Valid() {
    return form.owner_name.trim() && form.email.trim().includes('@') &&
           form.phone.trim().length >= 7 && form.business_name.trim();
  }

  async function handlePay() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BACKEND}/api/public/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, plan: selectedPlan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      if (data.payment_url) {
        // International payment link (non-INR) — open in new tab
        window.open(data.payment_url, '_blank');
        setSuccess(true);
        return;
      }

      if (data.razorpay_order_id) {
        const ok = await loadRazorpay();
        if (!ok) throw new Error('Payment gateway failed to load. Please try again.');

        const rzp = new window.Razorpay({
          key: data.razorpay_key,
          amount: data.amount,
          currency: data.currency,
          order_id: data.razorpay_order_id,
          name: 'BotPanel',
          description: `${plan.name} Plan — Monthly`,
          prefill: { name: form.owner_name, email: form.email, contact: form.phone },
          theme: { color: '#4f46e5' },
          handler: () => setSuccess(true),
          modal: { ondismiss: () => setLoading(false) },
        });
        rzp.open();
        return;
      }

      throw new Error('Unexpected response from server');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <div className="modal-body" style={{ paddingTop: 40 }}>
            <div className="success-state">
              <div className="success-icon">🎉</div>
              <h2>You're in!</h2>
              <p>
                Your BotPanel account is being set up. Check <strong>{form.email}</strong> for your
                login credentials and WhatsApp setup guide within the next few minutes.
              </p>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '16px 20px', textAlign: 'left', marginBottom: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#15803d', marginBottom: 8 }}>What happens next?</div>
                <div style={{ fontSize: 13, color: '#166534', lineHeight: 1.7 }}>
                  ✅ Account created automatically<br />
                  ✅ Login link sent to your email<br />
                  ✅ WhatsApp setup guide included<br />
                  ✅ Live in as little as 15 minutes
                </div>
              </div>
              <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <button className="modal-close" onClick={onClose}>×</button>
          <div className="modal-progress">
            {[1, 2, 3].map(s => (
              <div key={s} className={`progress-step ${step >= s ? 'done' : ''}`} />
            ))}
          </div>
        </div>

        <div className="modal-body" style={{ paddingTop: 20 }}>
          {/* Step 1 — Business details */}
          {step === 1 && (
            <>
              <div className="modal-title">Tell us about your business</div>
              <div className="modal-sub">Takes 2 minutes. No card required to start.</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your name *</label>
                  <input className="form-input" placeholder="Rajesh Kumar" value={form.owner_name} onChange={e => set('owner_name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Business name *</label>
                  <input className="form-input" placeholder="Spice Garden Restaurant" value={form.business_name} onChange={e => set('business_name', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email address *</label>
                  <input className="form-input" type="email" placeholder="you@business.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp number *</label>
                  <input className="form-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Business type *</label>
                  <select className="form-input form-select" value={form.business_type} onChange={e => set('business_type', e.target.value)}>
                    {BIZ_TYPES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Country *</label>
                  <select className="form-input form-select" value={form.country} onChange={e => set('country', e.target.value)}>
                    {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn btn-primary w-full mt-4" style={{ justifyContent: 'center' }}
                onClick={() => setStep(2)} disabled={!step1Valid()}>
                Continue →
              </button>
              <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--sub)' }}>
                🔒 Your data is secure and never shared
              </div>
            </>
          )}

          {/* Step 2 — Plan selection */}
          {step === 2 && (
            <>
              <div className="modal-title">Choose your plan</div>
              <div className="modal-sub">All plans include a 14-day free trial. Cancel anytime.</div>
              <div className="plan-options">
                {PLANS.map(p => (
                  <div key={p.id} className={`plan-option ${selectedPlan === p.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPlan(p.id)}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="plan-option-name">{p.name}</span>
                        {p.badge && <span className="plan-option-badge">{p.badge}</span>}
                      </div>
                      <div className="plan-option-price">{p.desc}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontWeight: 800, fontSize: 18 }}>{sym}{p.prices[country] ?? p.prices['IN']}<span style={{ fontWeight: 500, fontSize: 13, color: 'var(--sub)' }}>/mo</span></span>
                      <div className="plan-option-radio" />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={() => setStep(3)}>
                  Continue with {plan?.name} →
                </button>
              </div>
            </>
          )}

          {/* Step 3 — Payment */}
          {step === 3 && (
            <>
              <div className="modal-title">Complete your order</div>
              <div className="modal-sub">You'll be charged after your 14-day free trial ends.</div>

              <div style={{ background: 'var(--surf)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                <div style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 12 }}>Order summary</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>BotPanel {plan?.name}</span>
                  <span style={{ fontWeight: 800 }}>{sym}{price}/mo</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 12 }}>{plan?.desc}</div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--sub)' }}>
                    <span>Business</span><span>{form.business_name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--sub)', marginTop: 4 }}>
                    <span>Email</span><span>{form.email}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14, color: '#dc2626' }}>
                  ⚠️ {error}
                </div>
              )}

              <button className="btn btn-primary w-full mt-2" style={{ justifyContent: 'center', fontSize: 16 }}
                onClick={handlePay} disabled={loading}>
                {loading ? 'Processing…' : `Pay ${sym}${price} & Activate`}
              </button>

              <button className="btn btn-ghost w-full mt-4" style={{ justifyContent: 'center' }} onClick={() => setStep(2)}>← Change plan</button>

              <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--sub)', lineHeight: 1.7 }}>
                🔒 Secured by Razorpay · UPI, Cards, Net Banking accepted<br />
                🔄 14-day free trial · Cancel anytime · No hidden fees
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
