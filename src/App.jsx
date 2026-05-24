import React, { useState, useEffect, useRef } from 'react';
import SignupModal from './SignupModal';

/* ─── Scroll reveal hook ─── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── Navbar ─── */
function Nav({ onSignup }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo">
        <div className="nav-logo-icon">💬</div>
        <span className="nav-logo-name">BotPanel</span>
      </div>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#industries">Industries</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
      </div>
      <div className="nav-cta">
        <button className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(255,255,255,.3)', color: '#fff' }}>Login</button>
        <button className="btn btn-primary btn-sm" onClick={onSignup}>Get Started Free</button>
      </div>
      <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, top: 68, background: 'rgba(15,12,41,.98)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 32, zIndex: 99,
        }}>
          {['Features','Industries','Pricing','FAQ'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}
              onClick={() => setMenuOpen(false)}>{l}</a>
          ))}
          <button className="btn btn-primary btn-lg" onClick={() => { setMenuOpen(false); onSignup(); }}>Get Started Free</button>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero ─── */
function Hero({ onSignup }) {
  const [msgStep, setMsgStep] = useState(0);
  const msgs = [
    { from: 'user', text: 'Hi, I want to book a haircut for Saturday 3pm' },
    { from: 'bot',  text: '✂️ Great! Priya is available at 3 PM Saturday. Confirming your booking for *Classic Haircut* — ₹350.\n\nShall I confirm? 😊' },
    { from: 'user', text: 'Yes please!' },
    { from: 'bot',  text: '✅ Booked! You\'ll get a WhatsApp reminder 24 hours before. See you Saturday! 💇' },
  ];
  useEffect(() => {
    if (msgStep >= msgs.length) return;
    const t = setTimeout(() => setMsgStep(s => s + 1), msgStep === 0 ? 800 : 1800);
    return () => clearTimeout(t);
  }, [msgStep]);

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              <span>500+ businesses across 5 countries</span>
            </div>
            <h1 className="h1">
              Stop Losing Customers<br />
              <span className="gradient-text">on WhatsApp.</span>
            </h1>
            <p className="lead hero-sub">
              BotPanel's AI bot takes orders, books appointments, captures leads &
              sends payment links — <strong style={{ color: '#fff' }}>24/7, fully automated</strong>.
              No coding. Live in 15 minutes.
            </p>
            <div className="hero-ctas">
              <button className="btn btn-wa btn-lg" onClick={onSignup}>
                <span>💬</span> Start Free Trial
              </button>
              <a href="#industries" className="btn btn-outline btn-lg">See it in action →</a>
            </div>
            <div className="hero-stats">
              {[
                { num: '500+', label: 'Active businesses' },
                { num: '2M+',  label: 'Messages sent' },
                { num: '24/7', label: 'Bot uptime' },
                { num: '15min', label: 'Setup time' },
              ].map(s => (
                <div key={s.num}>
                  <div className="hero-stat-num">{s.num}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-phone">
              <div className="phone-header">
                <div className="phone-avatar">💇</div>
                <div>
                  <div className="phone-biz-name">Priya's Salon</div>
                  <div className="phone-biz-status">🟢 Online · AI Active</div>
                </div>
              </div>
              {msgs.slice(0, msgStep).map((m, i) => (
                <div key={i} className={`chat-bubble ${m.from === 'bot' ? 'bot' : 'user'}`}>
                  <div className={`bubble ${m.from === 'bot' ? 'bubble-bot' : 'bubble-user'}`}>
                    {m.text.split('\n').map((line, j) => <div key={j}>{line}</div>)}
                    <div className="bubble-time">{m.from === 'bot' ? '🤖' : '👤'} just now</div>
                  </div>
                </div>
              ))}
              {msgStep < msgs.length && msgStep > 0 && (
                <div className="chat-bubble bot">
                  <div className="typing-indicator">
                    <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                  </div>
                </div>
              )}
            </div>
            <div className="hero-badge hero-badge-1">
              <span className="badge-icon">🔔</span>
              <div>
                <div className="badge-label">New booking</div>
                <div className="badge-value">Saturday 3:00 PM</div>
              </div>
            </div>
            <div className="hero-badge hero-badge-2">
              <span className="badge-icon">💰</span>
              <div>
                <div className="badge-label">Payment received</div>
                <div className="badge-value">₹12,400 today</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Social Proof Bar ─── */
function ProofBar() {
  return (
    <div className="proof-bar">
      <div className="container">
        <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
          <span className="proof-text">Trusted across</span>
          <div className="proof-flags">
            {[
              { flag: '🇮🇳', name: 'India' },
              { flag: '🇬🇧', name: 'United Kingdom' },
              { flag: '🇺🇸', name: 'United States' },
              { flag: '🇦🇪', name: 'UAE' },
              { flag: '🇦🇺', name: 'Australia' },
            ].map((c, i) => (
              <React.Fragment key={c.name}>
                {i > 0 && <div className="proof-divider" />}
                <div className="proof-flag">
                  <span className="proof-flag-emoji">{c.flag}</span>
                  <span>{c.name}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Problem Section ─── */
function Problem() {
  return (
    <section className="section section-alt" id="problem">
      <div className="container text-center">
        <span className="label">The Problem</span>
        <h2 className="h2 reveal">Your WhatsApp is leaking<br />revenue every single day</h2>
        <p className="lead reveal" style={{ maxWidth: 580, margin: '16px auto 0' }}>
          Every unanswered message, every slow reply, every manual booking is a customer lost to your competitor.
        </p>
        <div className="problem-grid">
          {[
            { icon: '🌙', title: 'Customers message at midnight', body: 'They ask about your menu, timings, or pricing at 11 PM. You reply at 9 AM. They\'ve already ordered from someone else.' },
            { icon: '📋', title: '3 hours wasted on repetitive replies', body: '"What are your timings?" "What\'s the price?" Your staff copy-pastes the same answers 50 times a day. That\'s your money.' },
            { icon: '💸', title: 'Paying 25-30% commission to platforms', body: 'Zomato, Swiggy, Practo — they take a massive cut of every order placed on their platforms. Your own customers could order direct.' },
          ].map(p => (
            <div key={p.title} className="problem-card reveal">
              <div className="problem-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─── */
function HowItWorks({ onSignup }) {
  return (
    <section className="section" id="how">
      <div className="container text-center">
        <span className="label">How It Works</span>
        <h2 className="h2 reveal">From zero to automated<br />in under 15 minutes</h2>
        <div className="steps reveal">
          {[
            { n: '1', icon: '🔗', title: 'Connect your WhatsApp', body: 'Link your existing WhatsApp Business number via the official Meta API. We guide you through every step.', time: '~5 min' },
            { n: '2', icon: '🛍️', title: 'Add your products or services', body: 'Upload your menu, service list, or product catalog. Add photos, prices, variants — the bot learns everything.', time: '~5 min' },
            { n: '3', icon: '🤖', title: 'Your AI bot goes live 24/7', body: 'Customers message your WhatsApp, the bot handles orders, bookings, payments and lead capture — automatically.', time: 'Forever' },
          ].map(s => (
            <div key={s.n} className="step">
              <div className="step-num">{s.n}</div>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <span className="step-time">{s.time}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-primary btn-lg reveal" style={{ marginTop: 48 }} onClick={onSignup}>
          Start in 15 minutes →
        </button>
      </div>
    </section>
  );
}

/* ─── Industries ─── */
const INDUSTRIES = [
  {
    id: 'restaurant', emoji: '🍽️', name: 'Restaurant',
    label: 'Restaurant / Food',
    headline: 'Take orders directly on WhatsApp. Zero commission. Zero missed orders.',
    sub: 'Your customers already use WhatsApp. Let them order food, ask about the menu, and get delivery updates — without going through Zomato or Swiggy.',
    pains: [
      'Paying 25-30% commission on every Zomato/Swiggy order',
      'Miss calls during dinner rush, losing orders every evening',
      'Wrong orders from phone calls with background noise',
      'No direct way to build your own customer base',
    ],
    solutions: [
      'Customers order directly on WhatsApp — zero commission, full margin',
      'Bot handles dine-in, takeaway & delivery automatically 24/7',
      'Menu with photos, prices & variants — clear, no confusion',
      'Every customer contact saved to your own CRM',
    ],
    mockStats: [
      { icon: '🍕', label: 'Orders today', val: '34', badge: { text: '↑ 12 new', cls: 'badge-green' } },
      { icon: '💰', label: 'Revenue', val: '₹18,400', badge: { text: 'Dine-in · Takeaway', cls: 'badge-blue' } },
      { icon: '⏱️', label: 'Avg. response time', val: '< 3 sec', badge: { text: 'Bot active', cls: 'badge-green' } },
    ],
  },
  {
    id: 'salon', emoji: '💇', name: 'Salon & Spa',
    label: 'Salon / Spa',
    headline: 'Your WhatsApp books appointments 24/7 — even at midnight.',
    sub: 'Stop spending your day on the phone confirming bookings. BotPanel handles scheduling, staff allocation, reminders and follow-ups so your team focuses on the actual service.',
    pains: [
      'Staff spends 2-3 hours daily answering calls and booking appointments',
      'No-shows and last-minute cancellations with no warning',
      'Double bookings when two staff share one calendar',
      'Customers can\'t book outside business hours',
    ],
    solutions: [
      'AI bot books, confirms & reschedules appointments 24/7',
      'Automatic WhatsApp reminders 24h before reduce no-shows by 60%',
      'Per-stylist scheduling — blocks booked slots automatically',
      'Post-visit review requests sent automatically on WhatsApp',
    ],
    mockStats: [
      { icon: '📅', label: 'Bookings today', val: '11', badge: { text: '3 pending confirm', cls: 'badge-yellow' } },
      { icon: '⏰', label: 'Next available', val: '2:30 PM', badge: { text: 'Priya · 45 min', cls: 'badge-blue' } },
      { icon: '🔔', label: 'Reminders sent', val: '8', badge: { text: '0 no-shows', cls: 'badge-green' } },
    ],
  },
  {
    id: 'clinic', emoji: '🏥', name: 'Clinic',
    label: 'Clinic / Hospital',
    headline: 'Reduce no-shows by 60%. Let patients book, not call.',
    sub: 'Patients prefer messaging over calling. BotPanel lets them book appointments with their doctor, get confirmed instantly and receive WhatsApp reminders — all without tying up your receptionist.',
    pains: [
      'Receptionist overwhelmed with appointment calls all day',
      'Patients call 5 times to confirm a single appointment',
      'High no-show rate costing you paid appointment slots',
      'No automated follow-up after consultations',
    ],
    solutions: [
      'Patients book directly on WhatsApp — instant confirmation sent',
      'Automated 24h WhatsApp reminders slash no-shows dramatically',
      'Doctor-specific availability slots — never double-book',
      'Post-visit care messages and review requests automated',
    ],
    mockStats: [
      { icon: '🩺', label: 'Appointments today', val: '22', badge: { text: 'Dr. Mehta · Dr. Shah', cls: 'badge-blue' } },
      { icon: '📲', label: 'Reminders sent', val: '19', badge: { text: 'Auto at 24h', cls: 'badge-green' } },
      { icon: '✅', label: 'Confirmed rate', val: '94%', badge: { text: '↑ from 67%', cls: 'badge-green' } },
    ],
  },
  {
    id: 'ecommerce', emoji: '🛍️', name: 'E-commerce',
    label: 'E-commerce / Gifts',
    headline: 'Wake up to paid orders. No calls, no chasing, no follow-ups.',
    sub: 'Your WhatsApp bot qualifies B2B leads, shows your catalog, takes orders with branding details and sends Razorpay payment links — while you sleep. Full order management from your dashboard.',
    pains: [
      'Losing B2B deals because you can\'t respond fast enough to WhatsApp inquiries',
      'Hours wasted sending quotes, price lists and payment links manually',
      'No way to track order status, branding details and deadlines in one place',
      'Customers ghosting after showing interest because follow-up is too slow',
    ],
    solutions: [
      'Bot shows catalog, takes order details & branding specs automatically',
      'Razorpay payment link sent on WhatsApp the moment order is confirmed',
      'Full order dashboard — Pending, Confirmed, Shipped, Delivered',
      'Admin WhatsApp alert the moment a payment lands in your account',
    ],
    mockStats: [
      { icon: '📦', label: 'Orders today', val: '7', badge: { text: '₹84,000 value', cls: 'badge-green' } },
      { icon: '💳', label: 'Payments received', val: '₹2.4L', badge: { text: 'This week', cls: 'badge-blue' } },
      { icon: '⚡', label: 'Avg response time', val: 'Instant', badge: { text: '24/7 bot', cls: 'badge-green' } },
    ],
  },
  {
    id: 'realestate', emoji: '🏠', name: 'Real Estate',
    label: 'Real Estate',
    headline: 'Stop wasting time on tyre-kickers. Qualify every lead automatically.',
    sub: 'Your WhatsApp bot gathers budget, property preference and location from every inquiry before your agent even picks up the phone. Focus your team on buyers who are ready to move.',
    pains: [
      '90% of WhatsApp inquiries are time-wasters who never buy',
      'Sales team exhausted manually qualifying the same questions every day',
      'Leads go cold while waiting for a callback during busy hours',
      'No system to track lead pipeline from inquiry to closed deal',
    ],
    solutions: [
      'Bot qualifies every lead — budget, type, location — before you respond',
      'Instant WhatsApp acknowledgement keeps leads warm 24/7',
      'Full CRM pipeline from New → Contacted → Qualified → Closed',
      'Agent WhatsApp alert sent only for serious, qualified leads',
    ],
    mockStats: [
      { icon: '🏘️', label: 'Leads this week', val: '43', badge: { text: '11 qualified', cls: 'badge-green' } },
      { icon: '🎯', label: 'Qualified rate', val: '26%', badge: { text: 'Auto-filtered', cls: 'badge-blue' } },
      { icon: '📞', label: 'Agent time saved', val: '14 hrs', badge: { text: 'This week', cls: 'badge-green' } },
    ],
  },
];

function IndustryMock({ stats }) {
  return (
    <div className="industry-visual">
      <div className="mock-screen">
        <div className="mock-title">📊 Live Dashboard</div>
        {stats.map(s => (
          <div key={s.label} className="mock-card">
            <span className="mock-card-icon">{s.icon}</span>
            <div style={{ flex: 1 }}>
              <div className="mock-card-label">{s.label}</div>
              <div className="mock-card-val">{s.val}</div>
            </div>
            <span className={`mock-badge ${s.badge.cls}`}>{s.badge.text}</span>
          </div>
        ))}
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(37,211,102,.1)', borderRadius: 10, border: '1px solid rgba(37,211,102,.2)' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginBottom: 4 }}>WhatsApp Bot Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#4ade80' }}>
            <span style={{ width: 8, height: 8, background: '#4ade80', borderRadius: '50%', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
            Active · Responding in &lt; 3 seconds
          </div>
        </div>
      </div>
    </div>
  );
}

function Industries({ onSignup }) {
  const [active, setActive] = useState('restaurant');
  const ind = INDUSTRIES.find(i => i.id === active);
  return (
    <section className="section section-alt" id="industries">
      <div className="container">
        <div className="text-center reveal">
          <span className="label">By Industry</span>
          <h2 className="h2">Built for your specific business.<br />Not a generic chatbot.</h2>
          <p className="lead" style={{ maxWidth: 560, margin: '16px auto 0' }}>
            Every industry has different problems. BotPanel solves the exact ones yours faces.
          </p>
        </div>
        <div className="industry-tabs reveal" style={{ marginTop: 48 }}>
          {INDUSTRIES.map(i => (
            <button key={i.id} className={`industry-tab ${active === i.id ? 'active' : ''}`}
              onClick={() => setActive(i.id)}>
              {i.emoji} {i.name}
            </button>
          ))}
        </div>
        <div className="industry-panel">
          <div className="reveal">
            <div className="industry-label" style={{ color: 'var(--acc)' }}>{ind.label}</div>
            <h2 className="h2" style={{ marginBottom: 16 }}>{ind.headline}</h2>
            <p className="lead" style={{ marginBottom: 28 }}>{ind.sub}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>❌ The Problem</div>
                <ul className="pain-list">
                  {ind.pains.map(p => (
                    <li key={p} className="pain-item"><span className="pain-x">✗</span>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--wa)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>✅ The Solution</div>
                <ul className="solution-list">
                  {ind.solutions.map(s => (
                    <li key={s} className="solution-item"><span className="solution-check">✓</span>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
            <button className="btn btn-primary" onClick={onSignup}>
              Start Free for {ind.name} →
            </button>
          </div>
          <div className="reveal">
            <IndustryMock stats={ind.mockStats} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Features ─── */
const FEATURES = [
  { icon: '🤖', color: '#ede9fe', title: 'AI-Powered Bot', desc: 'Groq LLama 70B — understands natural language, handles complex conversations, never loses context.' },
  { icon: '📅', color: '#dbeafe', title: 'Appointment Booking', desc: 'Customers pick date, time and staff from available slots. Zero double bookings.' },
  { icon: '💳', color: '#dcfce7', title: 'Razorpay Payments', desc: 'Generate payment links from the dashboard and send via WhatsApp in one click.' },
  { icon: '🔔', color: '#fef9c3', title: 'Auto Reminders', desc: 'WhatsApp reminders fire 24 hours before every appointment. Slashes no-shows.' },
  { icon: '📢', color: '#fce7f3', title: 'Bulk Campaigns', desc: 'Send WhatsApp broadcasts to your customer list with rich templates.' },
  { icon: '📊', color: '#ede9fe', title: 'Analytics Dashboard', desc: 'Message volume, revenue trends, conversion rates — all in one view.' },
  { icon: '👥', color: '#e0f2fe', title: 'Staff Scheduling', desc: 'Per-staff working days, hours and slot duration. Availability shown to customers live.' },
  { icon: '🌍', color: '#f0fdf4', title: 'Multi-Currency', desc: '₹ INR · $ USD · £ GBP · AED · AUD — automatic per country.' },
  { icon: '📱', color: '#fff7ed', title: 'WhatsApp Native', desc: 'Interactive menus, buttons, image messages — no app download needed for customers.' },
  { icon: '📋', color: '#fef2f2', title: 'CRM & Contacts', desc: 'Every customer auto-saved. Import CSV, bulk campaigns, WhatsApp validation.' },
  { icon: '🔒', color: '#f5f3ff', title: 'Enterprise Security', desc: 'Supabase with Row Level Security. Your data is isolated and never shared.' },
  { icon: '⚡', color: '#ecfdf5', title: 'Live in 15 Minutes', desc: 'Guided setup wizard. Connect WhatsApp, add products, go live — all in one session.' },
];

function Features() {
  return (
    <section className="section" id="features">
      <div className="container text-center">
        <span className="label">Everything Included</span>
        <h2 className="h2 reveal">Every feature you need.<br />Nothing you don't.</h2>
        <p className="lead reveal" style={{ maxWidth: 520, margin: '16px auto 0' }}>
          No add-ons, no hidden fees. Every plan includes the full feature set.
        </p>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card reveal">
              <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
const CURRENCIES = [
  { code: 'IN', flag: '🇮🇳', sym: '₹',    label: 'INR' },
  { code: 'GB', flag: '🇬🇧', sym: '£',    label: 'GBP' },
  { code: 'US', flag: '🇺🇸', sym: '$',    label: 'USD' },
  { code: 'AE', flag: '🇦🇪', sym: 'AED ', label: 'AED' },
  { code: 'AU', flag: '🇦🇺', sym: 'A$',   label: 'AUD' },
];

const PLAN_DATA = [
  {
    id: 'starter', name: 'Starter', color: '#6366f1',
    prices: { IN: 2999, GB: 29, US: 35, AE: 129, AU: 55 },
    desc: 'Perfect for small businesses just getting started on WhatsApp automation.',
    features: [
      { on: true,  text: '500 WhatsApp messages/month' },
      { on: true,  text: '20 products or listings' },
      { on: true,  text: '3 staff members' },
      { on: true,  text: 'AI-powered WhatsApp bot' },
      { on: true,  text: 'Basic analytics' },
      { on: true,  text: 'Contacts & CRM' },
      { on: false, text: 'Bulk campaigns' },
      { on: false, text: 'Payment links (Razorpay)' },
      { on: false, text: 'Priority support' },
    ],
  },
  {
    id: 'growth', name: 'Growth', popular: true, color: '#4f46e5',
    prices: { IN: 5999, GB: 59, US: 69, AE: 249, AU: 109 },
    desc: 'For growing businesses ready to scale with automation and campaigns.',
    features: [
      { on: true,  text: '2,000 WhatsApp messages/month' },
      { on: true,  text: '100 products or listings' },
      { on: true,  text: '10 staff members' },
      { on: true,  text: 'AI-powered WhatsApp bot' },
      { on: true,  text: 'Full analytics & reports' },
      { on: true,  text: 'Contacts & CRM' },
      { on: true,  text: 'Bulk campaigns & broadcasts' },
      { on: true,  text: 'Payment links (Razorpay)' },
      { on: false, text: 'Priority support' },
    ],
  },
  {
    id: 'premium', name: 'Premium', color: '#7c3aed',
    prices: { IN: 11999, GB: 119, US: 139, AE: 499, AU: 219 },
    desc: 'For high-volume businesses that need unlimited scale and dedicated support.',
    features: [
      { on: true, text: '10,000 WhatsApp messages/month' },
      { on: true, text: 'Unlimited products & listings' },
      { on: true, text: 'Unlimited staff members' },
      { on: true, text: 'AI-powered WhatsApp bot' },
      { on: true, text: 'Full analytics & reports' },
      { on: true, text: 'Contacts & CRM' },
      { on: true, text: 'Bulk campaigns & broadcasts' },
      { on: true, text: 'Payment links (Razorpay)' },
      { on: true, text: 'Priority support & onboarding' },
    ],
  },
];

function Pricing({ onSignup }) {
  const [annual, setAnnual] = useState(false);
  const [cur, setCur] = useState('IN');
  const symObj = CURRENCIES.find(c => c.code === cur);
  const sym = symObj?.sym || '₹';
  return (
    <section className="section" id="pricing">
      <div className="container text-center">
        <span className="label">Pricing</span>
        <h2 className="h2 reveal">Simple pricing.<br />No surprises.</h2>
        <p className="lead reveal" style={{ maxWidth: 480, margin: '16px auto 24px' }}>
          Start with a 14-day free trial. No credit card required. Cancel anytime.
        </p>
        <div className="pricing-toggle reveal">
          <span className={`toggle-label ${!annual ? 'active' : ''}`}>Monthly</span>
          <div className={`toggle-track ${annual ? 'on' : ''}`} onClick={() => setAnnual(a => !a)}>
            <div className="toggle-thumb" />
          </div>
          <span className={`toggle-label ${annual ? 'active' : ''}`}>
            Annual <span className="save-badge">Save 20%</span>
          </span>
        </div>
        <div className="currency-row reveal">
          {CURRENCIES.map(c => (
            <button key={c.code} className={`currency-btn ${cur === c.code ? 'active' : ''}`}
              onClick={() => setCur(c.code)}>
              {c.flag} {c.label}
            </button>
          ))}
        </div>
        <div className="plans">
          {PLAN_DATA.map(p => {
            const rawPrice = p.prices[cur] ?? p.prices['IN'];
            const price = annual ? Math.round(rawPrice * 0.8) : rawPrice;
            return (
              <div key={p.id} className={`plan-card reveal ${p.popular ? 'popular' : ''}`}>
                {p.popular && <div className="popular-badge">⭐ Most Popular</div>}
                <div className="plan-name">{p.name}</div>
                <div className="plan-price">
                  <span className="plan-price-num">{sym}{price}</span>
                  <span className="plan-price-period">/mo</span>
                </div>
                {annual && <div style={{ fontSize: 12, color: 'var(--wa)', fontWeight: 600, marginBottom: 8 }}>Billed as {sym}{price * 12}/year</div>}
                <p className="plan-desc">{p.desc}</p>
                <ul className="plan-features">
                  {p.features.map(f => (
                    <li key={f.text} className="plan-feat">
                      <span className={`plan-feat-icon ${f.on ? 'feat-on' : 'feat-off'}`}>{f.on ? '✓' : '✕'}</span>
                      <span style={{ color: f.on ? 'var(--fg)' : 'var(--sub)' }}>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`btn w-full ${p.popular ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ justifyContent: 'center' }}
                  onClick={() => onSignup(p.id)}>
                  {p.popular ? `Start ${p.name} Free →` : `Get ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
        <p className="reveal" style={{ marginTop: 32, fontSize: 13, color: 'var(--sub)' }}>
          All prices exclusive of applicable taxes · Razorpay for India · International cards accepted
        </p>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
const TESTIS = [
  {
    stars: '★★★★★',
    text: '"We were paying ₹40,000/month to Zomato. After switching to BotPanel, our customers order directly on WhatsApp and we keep 100% of the revenue. Setup took less than 30 minutes."',
    name: 'Rajan Mehta', role: 'Owner, Spice Garden Restaurant, Mumbai',
    color: '#f97316', initials: 'RM',
  },
  {
    stars: '★★★★★',
    text: '"Our receptionist was spending 4 hours a day just booking appointments on the phone. Now the bot handles everything and she focuses on patients. No-shows dropped by 65%."',
    name: 'Dr. Priya Sharma', role: 'Founder, Wellness Clinic, Bangalore',
    color: '#06b6d4', initials: 'PS',
  },
  {
    stars: '★★★★★',
    text: '"I run a corporate gifting business and was losing B2B deals because I couldn\'t reply fast enough on WhatsApp. BotPanel bot handles initial inquiries and I only jump in for the final close."',
    name: 'Ahmed Al-Farsi', role: 'Director, Elite Corporate Gifts, Dubai',
    color: '#8b5cf6', initials: 'AA',
  },
  {
    stars: '★★★★★',
    text: '"Our salon in London books 80% of appointments through WhatsApp now. Clients love getting the reminder the day before — our no-shows went from 1 in 4 to almost zero."',
    name: 'Sophie Patel', role: 'Owner, Glow Salon, London',
    color: '#ec4899', initials: 'SP',
  },
  {
    stars: '★★★★★',
    text: '"Real estate lead qualification used to take our team\'s entire morning. Now the bot asks all the budget and preference questions automatically. We only call the serious buyers."',
    name: 'Vikram Nair', role: 'Sales Head, Prime Properties, Hyderabad',
    color: '#22c55e', initials: 'VN',
  },
  {
    stars: '★★★★★',
    text: '"BotPanel\'s analytics showed us that 40% of our WhatsApp messages came in after 9 PM. Now the bot handles those and we wake up to confirmed orders. Game changer for our bakery."',
    name: 'Lakshmi Reddy', role: 'Owner, Sweet Bloom Bakery, Chennai',
    color: '#f59e0b', initials: 'LR',
  },
];

function Testimonials() {
  return (
    <section className="section section-alt" id="testimonials">
      <div className="container text-center">
        <span className="label">Customer Stories</span>
        <h2 className="h2 reveal">Businesses across 5 countries<br />trust BotPanel</h2>
        <div className="testimonials-grid">
          {TESTIS.map(t => (
            <div key={t.name} className="testimonial-card reveal">
              <div className="testi-stars">{t.stars}</div>
              <p className="testi-text">{t.text}</p>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: t.color }}>{t.initials}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const FAQS = [
  { q: 'How long does setup take?', a: 'Most businesses are live within 15–30 minutes. You connect your WhatsApp number via the official Meta Business API, add your products or services, and your bot is ready. We guide you step by step.' },
  { q: 'Do I need a WhatsApp Business API account?', a: 'Yes — BotPanel uses the official WhatsApp Business API (not the regular app). We\'ll guide you through the application process, which typically takes 1–3 business days for approval. We\'ll help you every step of the way.' },
  { q: 'Will this work for my existing WhatsApp number?', a: 'Yes, you can use your existing WhatsApp Business number. Note: once connected to the API, the number can no longer be used with the regular WhatsApp app on a phone — but you\'ll have a full web dashboard instead.' },
  { q: 'What countries does BotPanel support?', a: 'BotPanel works globally. We\'re particularly popular in India 🇮🇳, United Kingdom 🇬🇧, United States 🇺🇸, UAE 🇦🇪 and Australia 🇦🇺. Payments are supported in INR, GBP, USD, AED and AUD.' },
  { q: 'How does the AI bot handle complex questions?', a: 'The bot is powered by Llama 3.3 70B (one of the most capable open-source AI models) and knows your specific products, prices, staff, and business details. For truly complex queries it can transfer to a human. It handles 90%+ of messages automatically.' },
  { q: 'Is my customer data secure?', a: 'Yes. BotPanel uses Supabase with Row Level Security — your data is completely isolated from other businesses. We never share or sell customer data. All communication is encrypted in transit.' },
  { q: 'Can I try before I pay?', a: 'Yes — every plan comes with a 14-day free trial. No credit card required to start. You pay only after you\'ve seen the bot working for your business.' },
  { q: 'What happens when I hit my message limit?', a: 'You\'ll get an email notification at 80% usage. You can top up with additional message credits any time from the dashboard, or upgrade your plan. The bot never goes silent unexpectedly.' },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="section" id="faq">
      <div className="container text-center">
        <span className="label">FAQ</span>
        <h2 className="h2 reveal">Everything you need to know</h2>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <div key={i} className={`faq-item reveal ${open === i ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
                {f.q}
                <span className="faq-chevron">▾</span>
              </button>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTASection({ onSignup }) {
  return (
    <section className="section cta-section">
      <div className="container">
        <span className="label label-wa reveal">Start Today</span>
        <h2 className="h2 reveal text-white" style={{ marginBottom: 20 }}>
          Your competitors are already<br />automating their WhatsApp.
        </h2>
        <p className="lead reveal" style={{ color: 'rgba(255,255,255,.65)', maxWidth: 520, margin: '0 auto 40px' }}>
          Every day without BotPanel is revenue left on the table. Join 500+ businesses that never miss a WhatsApp message again.
        </p>
        <div className="flex justify-center gap-4 flex-wrap reveal">
          <button className="btn btn-wa btn-lg" onClick={() => onSignup()}>
            <span>💬</span> Start Free — 14 Days, No Card
          </button>
          <a href="#pricing" className="btn btn-outline btn-lg">View Plans</a>
        </div>
        <p className="reveal" style={{ marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,.4)' }}>
          🇮🇳 India · 🇬🇧 UK · 🇺🇸 USA · 🇦🇪 UAE · 🇦🇺 Australia · Live in 15 minutes
        </p>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div className="nav-logo-icon">💬</div>
              <div className="footer-brand-name">BotPanel</div>
            </div>
            <p className="footer-brand-desc">
              WhatsApp AI automation platform for restaurants, salons, clinics, e-commerce stores and real estate agencies across India, UK, USA, UAE & Australia.
            </p>
            <div className="footer-socials" style={{ marginTop: 20 }}>
              {['𝕏', 'in', 'IG', 'YT'].map(s => (
                <a key={s} href="#" className="footer-social">{s}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Product</div>
            <ul className="footer-links">
              {['Features', 'Pricing', 'Industries', 'How it works', 'Changelog'].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Industries</div>
            <ul className="footer-links">
              {['Restaurant', 'Salon & Spa', 'Clinic', 'E-commerce', 'Real Estate'].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              {['About', 'Contact', 'Privacy Policy', 'Terms of Service', 'Refund Policy'].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <hr className="footer-divider" />
        <div className="footer-bottom">
          <span className="footer-copy">© 2025 BotPanel. All rights reserved.</span>
          <div className="footer-flags">🇮🇳 🇬🇧 🇺🇸 🇦🇪 🇦🇺</div>
          <span className="footer-copy">Powered by WhatsApp Business API · Razorpay · Supabase</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── App ─── */
export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [defaultPlan, setDefaultPlan] = useState('growth');
  useReveal();

  function openSignup(plan) {
    setDefaultPlan(plan || 'growth');
    setShowModal(true);
  }

  return (
    <>
      <Nav onSignup={() => openSignup()} />
      <Hero onSignup={() => openSignup()} />
      <ProofBar />
      <Problem />
      <HowItWorks onSignup={() => openSignup()} />
      <Industries onSignup={openSignup} />
      <Features />
      <Pricing onSignup={openSignup} />
      <Testimonials />
      <FAQ />
      <CTASection onSignup={openSignup} />
      <Footer />
      {showModal && <SignupModal onClose={() => setShowModal(false)} defaultPlan={defaultPlan} />}
    </>
  );
}
