import React, { useState, useEffect, useRef } from 'react';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';

/* ─── Scroll reveal hook ─── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── Parallax engine — translates [data-parallax] layers on scroll (rAF, passive) ─── */
function useParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = Array.from(document.querySelectorAll('[data-parallax]'));
    if (!els.length) return;
    let raf = 0;
    const update = () => {
      const vh = window.innerHeight;
      for (const el of els) {
        const speed = parseFloat(el.dataset.parallax) || 0;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const offset = (center - vh / 2) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
}

/* ─── Sticky Mobile CTA ─── */
function StickyMobileCTA({ onSignup }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 500) setVisible(true); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!visible) return null;
  return (
    <div className="sticky-mobile-cta">
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Start Free — 14 Days</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>No credit card · Live in 15 min</div>
      </div>
      <button className="btn btn-wa" style={{ padding: '10px 20px', fontSize: 14, flexShrink: 0 }} onClick={onSignup}>
        💬 Get Started →
      </button>
    </div>
  );
}

/* ─── Pattern Interrupt Stat Bar ─── */
function StatInterrupt() {
  const stats = [
    '📱 WhatsApp has 98% open rate vs 21% for email — yet most businesses still miss messages for hours',
    '⏱️ Customers who don\'t get a WhatsApp reply in 5 minutes are 80% likely to message a competitor',
    '💸 Restaurants lose ₹18,000+ every month just from after-hours unanswered orders',
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % stats.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="stat-interrupt">
      <div className="stat-interrupt-inner">
        <span className="stat-interrupt-pill">Did you know?</span>
        <span key={idx} style={{ animation: 'fadeIn .4s' }}>{stats[idx]}</span>
      </div>
    </div>
  );
}

/* ─── Navbar ─── */
function Nav({ onSignup, onLogin }) {
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
        <span className="nav-logo-name">Noeta</span>
      </div>
      <div className="nav-links">
        <a href="#problem">Why Noeta</a>
        <a href="#sales-intelligence">Sales AI</a>
        <a href="#features">Features</a>
        <a href="#industries">Industries</a>
        <a href="#pricing">Pricing</a>
      </div>
      <div className="nav-cta">
        <button className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(255,255,255,.3)', color: '#fff' }} onClick={onLogin}>Login</button>
        <button className="btn btn-wa btn-sm" onClick={onSignup}>Start Free Trial</button>
      </div>
      <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        {menuOpen ? '✕' : '☰'}
      </button>
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, top: 68, background: 'rgba(15,12,41,.98)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 28, zIndex: 99, padding: '0 24px',
        }}>
          {[['Why Noeta','#problem'],['Sales AI','#sales-intelligence'],['Features','#features'],['Industries','#industries'],['Pricing','#pricing']].map(([l,h]) => (
            <a key={l} href={h} style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}
              onClick={() => setMenuOpen(false)}>{l}</a>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280, marginTop: 8 }}>
            <button className="btn btn-wa btn-lg" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => { setMenuOpen(false); onSignup(); }}>💬 Start Free Trial</button>
            <button className="btn btn-outline btn-lg" style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(255,255,255,.3)', color: '#fff' }}
              onClick={() => { setMenuOpen(false); onLogin(); }}>Login</button>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero ─── */
function Hero({ onSignup }) {
  const [tickerIdx, setTickerIdx] = useState(0);
  const tickers = [
    '🟢 Closes B2B orders overnight — while you sleep',
    '🟢 Qualifies your ad leads automatically — wake up to a sorted pipeline',
    '🟢 Recovers abandoned carts with automatic follow-up',
    '🟢 Takes direct orders 24/7 — zero platform commission',
  ];
  useEffect(() => {
    const t = setInterval(() => setTickerIdx(i => (i + 1) % tickers.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="hero">
      <div className="hero-orbs" data-parallax="0.14" aria-hidden="true">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-orb hero-orb-4" />
      </div>
      <svg className="hero-curves" data-parallax="0.06" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path className="hero-curve-path hero-curve-path-1" d="M-100,250 C200,50 500,500 800,250 S1200,0 1540,250" />
        <path className="hero-curve-path hero-curve-path-2" d="M-100,500 C250,250 550,750 850,500 S1250,200 1540,500" />
        <path className="hero-curve-path hero-curve-path-3" d="M0,700 C350,450 650,850 950,650 S1300,350 1440,700" />
      </svg>
      <div className="container">
        <div className="hero-grid hero-centered">
          <div className="hero-copy">
            {/* Live Ticker */}
            <div className="live-ticker" key={tickerIdx} style={{ animation: 'fadeIn .5s' }}>
              <span className="live-ticker-dot" />
              <span>{tickers[tickerIdx]}</span>
            </div>
            <h1 className="h1">
              <span className="text-metal">While You Sleep,</span><br />
              <span className="gradient-text">Your WhatsApp Closes Deals.</span>
            </h1>
            <p className="lead hero-sub">
              Noeta is a full <strong style={{ color: '#fff' }}>AI sales force on WhatsApp</strong> — it studies
              every lead, handles objections, negotiates, sends payment links, recovers lost sales,
              and even runs your social media. <strong style={{ color: '#fff' }}>60+ tools. One number.</strong>
            </p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', marginBottom: 32, marginTop: -20 }}>
              Most "WhatsApp bots" just reply. Noeta actually sells — and tells you why every deal won or lost.
            </p>
            <div className="hero-ctas">
              <button className="btn btn-wa btn-lg" onClick={onSignup}>
                <span>💬</span> Start Free — 14 Days, No Card
              </button>
              <a href="#roi" className="btn btn-outline btn-lg">Calculate My ROI →</a>
            </div>
            <div className="hero-stats">
              {[
                { num: '60+',  label: 'Built-in tools' },
                { num: '13',   label: 'AI sales engines' },
                { num: '24/7', label: 'Sells & follows up' },
                { num: '15min', label: 'Setup time' },
              ].map(s => (
                <div key={s.num}>
                  <div className="hero-stat-num">{s.num}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Live Demo Showcase (the WhatsApp closing animation) ─── */
function LiveDemo() {
  const [msgStep, setMsgStep] = useState(0);
  const msgs = [
    { from: 'user', text: 'Saw your ad — what\'s the price for 50 units? A bit out of budget tbh' },
    { from: 'bot',  text: '👋 Great choice! For 50 units it\'s ₹499 each. I hear you on budget — that\'s just *₹16/day* over the season, and it replaces ₹40k of manual work.\n\nWant me to lock our intro price before it goes up? 😊' },
    { from: 'user', text: 'Okay that works, send me the link' },
    { from: 'bot',  text: '✅ Done! Razorpay payment link sent — ₹24,950. Your GST invoice generates automatically on payment. Closing this for you now 🎯' },
  ];
  useEffect(() => {
    if (msgStep >= msgs.length) return;
    const t = setTimeout(() => setMsgStep(s => s + 1), msgStep === 0 ? 900 : 1800);
    return () => clearTimeout(t);
  }, [msgStep]);
  return (
    <section className="section live-demo">
      <div className="container">
        <div className="live-demo-grid">
          <div className="live-demo-copy reveal">
            <span className="label">Live · Watch It Close</span>
            <h2 className="h2">See a real deal<br />close itself.</h2>
            <p className="lead" style={{ marginTop: 18, maxWidth: 480 }}>
              An ad lead lands, pushes back on budget, and Noeta anchors the value, breaks the price
              into ₹/day, locks the intro offer, and fires the payment link — start to finish, on its own.
            </p>
            <ul className="live-demo-points">
              <li><span className="ld-check">✅</span> Studies the lead and the real objection</li>
              <li><span className="ld-check">✅</span> Negotiates only within the margin you set</li>
              <li><span className="ld-check">✅</span> Sends Razorpay link + auto GST invoice</li>
            </ul>
          </div>
          <div className="hero-visual live-demo-visual" data-parallax="-0.05">
            <div className="hero-phone">
              <div className="phone-header">
                <div className="phone-avatar">🛍️</div>
                <div>
                  <div className="phone-biz-name">Elite Corporate Gifts</div>
                  <div className="phone-biz-status">🟢 Online · AI Closing</div>
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

/* ─── Powered By Trust Bar ─── */
function TrustBar() {
  return (
    <div className="trust-bar">
      <div className="container">
        <div className="trust-bar-inner">
          <span style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em' }}>Powered by</span>
          {[
            { icon: '💬', name: 'Meta Business API' },
            { icon: '💳', name: 'Razorpay' },
            { icon: '🧠', name: 'Groq LLama AI' },
            { icon: '☁️', name: 'AWS S3' },
            { icon: '🛡️', name: 'Supabase RLS' },
          ].map(t => (
            <div key={t.name} className="trust-item">
              <span className="trust-item-icon">{t.icon}</span>
              <span>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Bento Results (capability stats, honest numbers) ─── */
function BentoResults() {
  const cards = [
    { tag: 'AI Sales Engines', num: '13', label: 'Deal Coach intelligence working every single chat', tone: 'v' },
    { tag: 'Built-in Tools',   num: '60+', label: 'Sales, leads, social & ops — all on one number', tone: 'c' },
    { tag: 'Always On',        num: '24/7', label: 'Never misses a lead, never sleeps, never calls in sick', tone: 'p' },
  ];
  return (
    <section className="section">
      <div className="container text-center">
        <span className="label">Built To Close</span>
        <h2 className="h2 reveal">Not a chatbot.<br />A revenue system.</h2>
        <p className="lead reveal" style={{ maxWidth: 620, margin: '16px auto 0' }}>
          Real product. Real infrastructure. One WhatsApp number doing the work of a full sales team.
        </p>
        <div className="bento reveal">
          {cards.map(c => (
            <div key={c.tag} className={`bento-card ${c.tone}`}>
              <div className="bento-top">
                <span className="bento-tag">{c.tag}</span>
                <span className="bento-arrow" aria-hidden="true">↗</span>
              </div>
              <div className="bento-num">{c.num}</div>
              <div className="bento-label">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Problem Section (6 Pains) ─── */
function Problem() {
  const pains = [
    {
      icon: '🌙', color: '#ef4444',
      title: 'The after-hours blindspot is costing you every night',
      body: '40% of WhatsApp messages arrive between 7 PM and midnight. Your bot was offline. Your competitor\'s wasn\'t. That\'s not a small problem — that\'s your dinner rush going to the wrong kitchen.',
    },
    {
      icon: '💸', color: '#f97316',
      title: 'Platforms are taking your margin, and your customers',
      body: 'A restaurant doing ₹6 lakh/month on Zomato pays ₹1.5 lakh in commission. Every month. That\'s not a fee — that\'s your profit. And they own your customer data, not you.',
    },
    {
      icon: '⏱️', color: '#eab308',
      title: 'Your best staff are human autoresponders',
      body: '"What are your timings?" "What\'s the price?" "Is X available?" Your team answers these 60 times a day. That\'s 3 hours of skilled human labour spent copy-pasting the same 10 replies.',
    },
    {
      icon: '⚡', color: '#8b5cf6',
      title: 'Speed is the sale. You\'re always 4 hours late',
      body: 'A customer who doesn\'t hear back in 5 minutes is gone. Not next week — in 5 minutes. They\'ve opened another chat, made another booking. You replied at 9 AM. They confirmed at 11:05 PM last night.',
    },
    {
      icon: '🎯', color: '#06b6d4',
      title: '80% of your WhatsApp leads are tyre-kickers',
      body: 'Your team spends equal time on everyone — the serious buyer and the person who just wants to compare prices and ghost. There\'s no filter. The real leads wait while you handle the fake ones.',
    },
    {
      icon: '📊', color: '#10b981',
      title: 'You\'re flying blind — no data, no follow-up system',
      body: 'Every lead who messaged you this month and didn\'t convert? They\'re gone. No follow-up sent. No CRM record. No re-engagement campaign. That\'s a leaky bucket — you keep filling, it keeps draining.',
    },
  ];
  return (
    <section className="section section-alt" id="problem">
      <div className="container text-center">
        <span className="label">The Real Problem</span>
        <h2 className="h2 reveal">Your WhatsApp is a<br /><span style={{ color: '#ef4444', WebkitTextFillColor: '#ef4444' }}>revenue leak</span> disguised as a channel</h2>
        <p className="lead reveal" style={{ maxWidth: 600, margin: '16px auto 0' }}>
          You're getting messages. You're just losing customers, margins, and hours — silently, every single day.
        </p>
        <div className="problem-grid-6">
          {pains.map(p => (
            <div key={p.title} className="problem-card reveal" style={{ textAlign: 'left' }}>
              <div className="problem-icon">{p.icon}</div>
              <h3 style={{ marginBottom: 10 }}>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Day Comparison ─── */
function DayComparison({ onSignup }) {
  const bad = [
    { time: '11 PM', body: 'Customer messages asking about availability. Goes to sleep. No reply from you.' },
    { time: '9 AM',  body: 'You wake up, see 14 missed messages. Start replying. Half have already booked elsewhere.' },
    { time: '12 PM', body: 'Staff spend 2 hours answering repetitive questions instead of actual work.' },
    { time: '6 PM',  body: 'Dinner rush. 6 missed calls. 3 wrong orders taken over noisy phone line.' },
    { time: '9 PM',  body: 'You stop responding. 4 more customers message. None get replies.' },
    { time: 'Month end', body: 'Zomato invoice arrives: ₹1.5L in commissions. Revenue goes to them, not you.' },
  ];
  const good = [
    { time: '11 PM', body: 'Customer messages. Bot responds in 3 seconds, books appointment, sends confirmation.' },
    { time: '9 AM',  body: 'You wake up to 7 confirmed orders, 3 new bookings, ₹22,000 in overnight revenue.' },
    { time: '12 PM', body: 'Staff focus on actual service. Bot handles all questions automatically.' },
    { time: '6 PM',  body: 'Bot handles 23 dinner rush messages simultaneously. Zero errors. Zero missed orders.' },
    { time: '9 PM',  body: 'Bot stays live. 4 more orders taken. Payment links sent. Confirmations done.' },
    { time: 'Month end', body: '₹0 in platform commissions. All orders direct. 100% margin retained. Your CRM growing.' },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="text-center reveal">
          <span className="label">Before vs After</span>
          <h2 className="h2">The same Tuesday.<br />Two very different businesses.</h2>
          <p className="lead" style={{ maxWidth: 540, margin: '16px auto 0' }}>
            Here's exactly how Noeta changes your day — from the first message to month-end revenue.
          </p>
        </div>
        <div className="day-compare-grid reveal">
          <div className="day-col">
            <div className="day-col-header bad">❌ Without Noeta</div>
            {bad.map((e, i) => (
              <div key={i} className="day-event bad">
                <span className="day-event-time">{e.time}</span>
                <span className="day-event-body">{e.body}</span>
              </div>
            ))}
          </div>
          <div className="day-col">
            <div className="day-col-header good">✅ With Noeta</div>
            {good.map((e, i) => (
              <div key={i} className="day-event good">
                <span className="day-event-time">{e.time}</span>
                <span className="day-event-body">{e.body}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center reveal" style={{ marginTop: 40 }}>
          <button className="btn btn-wa btn-lg" onClick={onSignup}>
            💬 I want the right column →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─── */
function HowItWorks({ onSignup }) {
  return (
    <section className="section section-alt" id="how">
      <div className="container text-center">
        <span className="label">How It Works</span>
        <h2 className="h2 reveal">From zero to automated<br />in under 15 minutes</h2>
        <p className="lead reveal" style={{ maxWidth: 520, margin: '16px auto 0' }}>
          No developer. No agency. No weeks of waiting. You set it up yourself in one session.
        </p>
        <div className="steps reveal">
          {[
            { n: '1', icon: '🔗', title: 'Connect your WhatsApp', body: 'Link your existing WhatsApp Business number via the official Meta API. We guide you through every step — approval typically takes 1–3 days.', time: '~5 min setup' },
            { n: '2', icon: '🛍️', title: 'Add your products or services', body: 'Upload your menu, service list, or product catalog. Add photos, prices, variants — the bot learns everything and answers accordingly.', time: '~5 min setup' },
            { n: '3', icon: '🤖', title: 'Your AI bot goes live 24/7', body: 'Customers message your WhatsApp, the bot handles orders, bookings, payments and lead capture — automatically, while you run your business.', time: 'Forever after' },
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

/* ─── ROI Calculator ─── */
function ROICalculator({ onSignup }) {
  const [industry, setIndustry] = useState('ecommerce');
  const [orders, setOrders] = useState(80);
  const [avgValue, setAvgValue] = useState(1200);
  const [commission, setCommission] = useState(15);
  const [staffHrs, setStaffHrs] = useState(2);

  const commissionLoss = Math.round((orders * avgValue * commission) / 100);
  const staffCost = Math.round(staffHrs * 200 * 26);
  const afterHoursMissed = Math.round(orders * avgValue * 0.15);
  const totalLeak = commissionLoss + staffCost + afterHoursMissed;
  const noetaCost = 3999;
  const netSavings = totalLeak - noetaCost;

  const industryDefaults = {
    restaurant:  { orders: 150, avg: 400, comm: 28, staff: 3 },
    salon:       { orders: 60,  avg: 800, comm: 0,  staff: 2 },
    clinic:      { orders: 40,  avg: 600, comm: 0,  staff: 2 },
    ecommerce:   { orders: 80,  avg: 1200,comm: 15, staff: 2 },
    realestate:  { orders: 30,  avg: 0,   comm: 0,  staff: 4 },
  };

  function handleIndustry(ind) {
    setIndustry(ind);
    const d = industryDefaults[ind];
    setOrders(d.orders);
    setAvgValue(d.avg);
    setCommission(d.comm);
    setStaffHrs(d.staff);
  }

  return (
    <section className="section" id="roi">
      <div className="container text-center">
        <span className="label">ROI Calculator</span>
        <h2 className="h2 reveal">How much is NOT automating<br />costing you right now?</h2>
        <p className="lead reveal" style={{ maxWidth: 560, margin: '16px auto 0' }}>
          Fill in your numbers. See exactly what WhatsApp inaction costs your business per month.
        </p>
        <div className="roi-calc reveal">
          <div className="roi-calc-grid">
            <div>
              <div className="roi-input-group">
                <label className="roi-label">Your Industry</label>
                <select className="roi-input" value={industry} onChange={e => handleIndustry(e.target.value)}>
                  <option value="restaurant">🍽️ Restaurant / Food</option>
                  <option value="salon">💇 Salon & Spa</option>
                  <option value="clinic">🏥 Clinic / Hospital</option>
                  <option value="ecommerce">🛍️ E-commerce / Retail</option>
                  <option value="realestate">🏠 Real Estate</option>
                </select>
              </div>
              <div className="roi-input-group">
                <label className="roi-label">Monthly Orders / Bookings</label>
                <input className="roi-input" type="number" min="1" value={orders} onChange={e => setOrders(+e.target.value || 0)} />
              </div>
              <div className="roi-input-group">
                <label className="roi-label">Average Order Value (₹)</label>
                <input className="roi-input" type="number" min="0" value={avgValue} onChange={e => setAvgValue(+e.target.value || 0)} />
              </div>
              <div className="roi-input-group">
                <label className="roi-label">Platform Commission % (Zomato/Swiggy/etc.)</label>
                <input className="roi-input" type="number" min="0" max="50" value={commission} onChange={e => setCommission(+e.target.value || 0)} />
              </div>
              <div className="roi-input-group">
                <label className="roi-label">Staff hours/day spent on WhatsApp</label>
                <input className="roi-input" type="number" min="0" max="12" value={staffHrs} onChange={e => setStaffHrs(+e.target.value || 0)} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 16 }}>
                📊 Your Monthly Revenue Leak
              </div>
              <div className="roi-result">
                <div className="roi-result-row">
                  <span className="roi-result-label">💸 Platform commissions lost</span>
                  <span className="roi-result-val negative">−₹{commissionLoss.toLocaleString()}</span>
                </div>
                <div className="roi-result-row">
                  <span className="roi-result-label">⏱️ Staff cost on repetitive replies</span>
                  <span className="roi-result-val negative">−₹{staffCost.toLocaleString()}</span>
                </div>
                <div className="roi-result-row">
                  <span className="roi-result-label">🌙 After-hours missed revenue (est. 15%)</span>
                  <span className="roi-result-val negative">−₹{afterHoursMissed.toLocaleString()}</span>
                </div>
                <div className="roi-total-row">
                  <span className="roi-total-label">Total monthly leak</span>
                  <span className="roi-total-val">₹{totalLeak.toLocaleString()}</span>
                </div>
                <div style={{ marginTop: 20, padding: '16px', background: 'rgba(37,211,102,.08)', borderRadius: 12, border: '1px solid rgba(37,211,102,.2)' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginBottom: 6 }}>Noeta Growth Plan</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,.7)' }}>Monthly cost</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>₹{noetaCost.toLocaleString()}/mo</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(37,211,102,.2)', marginTop: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,.8)' }}>Your net savings</span>
                    <span style={{ fontSize: 20, fontWeight: 900, color: '#4ade80' }}>₹{Math.max(0, netSavings).toLocaleString()}/mo</span>
                  </div>
                </div>
                <button className="btn btn-wa w-full" style={{ marginTop: 16, justifyContent: 'center' }} onClick={onSignup}>
                  💬 Start Saving →
                </button>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 12 }}>
                * Estimates based on industry averages. Actual results vary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Industries ─── */
const INDUSTRIES = [
  {
    id: 'restaurant', emoji: '🍽️', name: 'Restaurant',
    label: 'Restaurant / Food',
    headline: 'Stop paying ₹1.5L/month to Zomato. Take orders direct on WhatsApp.',
    sub: 'A restaurant doing ₹6 lakh/month on delivery platforms pays ₹1.5 lakh in commissions. Your customers already have WhatsApp. Let them order food, ask about the menu, and get delivery updates — without giving Zomato a rupee.',
    pains: [
      'Paying 25–30% commission on every Zomato/Swiggy order — ₹1.5L gone every month',
      'Miss calls during dinner rush, losing 6–8 orders every single evening',
      'Wrong orders from noisy phone calls — refunds, waste, bad reviews',
      'No direct customer base — Zomato owns your data, not you',
    ],
    solutions: [
      'Customers order directly on WhatsApp — zero commission, 100% margin',
      'Bot handles dine-in, takeaway & delivery 24/7 — even at midnight',
      'Menu with photos, prices & variants — clear orders, zero confusion',
      'Every customer auto-saved to your CRM — yours forever',
    ],
    mockStats: [
      { icon: '🍕', label: 'Orders today', val: '34', badge: { text: '↑ 12 new', cls: 'badge-green' } },
      { icon: '💰', label: 'Revenue', val: '₹18,400', badge: { text: 'Dine-in · Takeaway', cls: 'badge-blue' } },
      { icon: '⏱️', label: 'Avg. response time', val: '< 3 sec', badge: { text: 'Bot active', cls: 'badge-green' } },
    ],
    caseQuote: '"We were paying ₹40,000/month to Zomato. After switching to Noeta, our customers order directly and we keep 100% margin." — Rajan Mehta, Spice Garden, Mumbai',
  },
  {
    id: 'salon', emoji: '💇', name: 'Salon & Spa',
    label: 'Salon / Spa',
    headline: 'Your WhatsApp books appointments 24/7 — even at midnight. No-shows cut by 60%.',
    sub: 'Stop spending your day on the phone confirming bookings. Noeta handles scheduling, staff allocation, reminders and follow-ups so your team focuses on the actual service. Clients book at 11 PM; you see the calendar full in the morning.',
    pains: [
      'Staff spends 2–3 hours daily answering calls and booking appointments',
      'No-shows and last-minute cancellations cost you full paid slots',
      'Double bookings when two clients share one stylist slot',
      'Customers can\'t book outside business hours — they book competitors',
    ],
    solutions: [
      'AI bot books, confirms & reschedules appointments 24/7',
      'Automatic WhatsApp reminders 24h before reduce no-shows by 60%',
      'Per-stylist scheduling — blocks booked slots automatically',
      'Post-visit review requests sent automatically via WhatsApp',
    ],
    mockStats: [
      { icon: '📅', label: 'Bookings today', val: '11', badge: { text: '3 pending confirm', cls: 'badge-yellow' } },
      { icon: '⏰', label: 'Next available', val: '2:30 PM', badge: { text: 'Priya · 45 min', cls: 'badge-blue' } },
      { icon: '🔔', label: 'Reminders sent', val: '8', badge: { text: '0 no-shows', cls: 'badge-green' } },
    ],
    caseQuote: '"Our salon in London books 80% of appointments through WhatsApp now. No-shows went from 1 in 4 to almost zero." — Sophie Patel, Glow Salon, London',
  },
  {
    id: 'clinic', emoji: '🏥', name: 'Clinic',
    label: 'Clinic / Hospital',
    headline: 'Reduce no-shows by 60%. Free your receptionist. Let patients book, not call.',
    sub: 'Patients prefer messaging over calling. Noeta lets them book appointments with their doctor, get confirmed instantly and receive WhatsApp reminders — all without tying up your receptionist for hours every day.',
    pains: [
      'Receptionist overwhelmed with appointment calls — entire morning gone',
      'Patients call 5 times to confirm a single appointment',
      'High no-show rate — you\'re losing fully paid appointment slots',
      'No automated follow-up or care messages after consultations',
    ],
    solutions: [
      'Patients book directly on WhatsApp — instant confirmation sent',
      'Automated 24h WhatsApp reminders slash no-shows dramatically',
      'Doctor-specific slots — never double-book or over-schedule',
      'Post-visit care messages and review requests — fully automated',
    ],
    mockStats: [
      { icon: '🩺', label: 'Appointments today', val: '22', badge: { text: 'Dr. Mehta · Dr. Shah', cls: 'badge-blue' } },
      { icon: '📲', label: 'Reminders sent', val: '19', badge: { text: 'Auto at 24h', cls: 'badge-green' } },
      { icon: '✅', label: 'Confirmed rate', val: '94%', badge: { text: '↑ from 67%', cls: 'badge-green' } },
    ],
    caseQuote: '"Our receptionist was spending 4 hours a day just booking. Now the bot handles everything and she focuses on patients. No-shows dropped 65%." — Dr. Priya Sharma, Bangalore',
  },
  {
    id: 'ecommerce', emoji: '🛍️', name: 'E-commerce / B2B',
    label: 'E-commerce / D2C / B2B',
    headline: 'Turn ad clicks into closed orders. The bot studies every lead and chases the money.',
    sub: 'Your WhatsApp bot qualifies B2B leads, shows your catalog, takes orders with branding details and sends Razorpay payment links — while you sleep. Full order management from your dashboard.',
    pains: [
      'Losing B2B deals because you can\'t respond fast enough on WhatsApp',
      'Hours wasted sending quotes, price lists and payment links manually',
      'No way to track order status, branding details and deadlines in one place',
      'Customers ghost after showing interest because follow-up is too slow',
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
    caseQuote: '"I was losing B2B deals because I couldn\'t reply fast enough on WhatsApp. Noeta bot handles initial inquiries and I only close the deal." — Ahmed Al-Farsi, Dubai',
  },
  {
    id: 'realestate', emoji: '🏠', name: 'Real Estate',
    label: 'Real Estate',
    headline: 'Stop wasting time on tyre-kickers. Qualify every lead automatically.',
    sub: 'Your WhatsApp bot gathers budget, property preference and location from every inquiry before your agent even picks up the phone. Focus your team only on buyers who are ready to move — not just browsing.',
    pains: [
      '90% of WhatsApp inquiries are time-wasters who never buy',
      'Sales team exhausted manually qualifying the same questions every day',
      'Leads go cold while waiting for a callback during busy hours',
      'No pipeline system — no idea which leads are hot vs cold',
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
    caseQuote: '"Real estate lead qualification used to take our team\'s entire morning. Now the bot filters automatically. We only call the serious buyers." — Vikram Nair, Hyderabad',
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

// High-ARPU lead-gen verticals first (they use the sales-intelligence moat), then the transactional on-ramp.
const INDUSTRY_ORDER = ['ecommerce', 'realestate', 'restaurant', 'salon', 'clinic'];

function Industries({ onSignup }) {
  const [active, setActive] = useState('ecommerce');
  const ordered = INDUSTRY_ORDER.map(id => INDUSTRIES.find(i => i.id === id)).filter(Boolean);
  const ind = INDUSTRIES.find(i => i.id === active);
  return (
    <section className="section section-alt" id="industries">
      <div className="container">
        <div className="text-center reveal">
          <span className="label">By Industry</span>
          <h2 className="h2">Built for your specific business.<br />Not a generic chatbot.</h2>
          <p className="lead" style={{ maxWidth: 560, margin: '16px auto 0' }}>
            Every industry has different problems. Noeta solves the exact ones yours faces.
          </p>
        </div>
        <div className="industry-tabs reveal" style={{ marginTop: 48 }}>
          {ordered.map(i => (
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
            <div className="pains-solutions-grid">
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
            {ind.caseQuote && (
              <blockquote style={{
                background: 'rgba(79,70,229,.06)', border: '1px solid rgba(79,70,229,.15)',
                borderLeft: '3px solid var(--acc)', borderRadius: 10, padding: '14px 18px',
                fontSize: 13, color: 'var(--sub)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 24,
              }}>
                <span style={{ display: 'block', fontStyle: 'normal', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--acc)', marginBottom: 6 }}>Illustrative example</span>
                {ind.caseQuote}
              </blockquote>
            )}
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

/* ─── Comparison Table ─── */
function ComparisonTable({ onSignup }) {
  const rows = [
    { label: 'Monthly Cost',          staff: '₹15,000–25,000 salary', platform: '25–30% commission', generic: '₹8,000–15,000', noeta: 'From ₹1,499/mo' },
    { label: 'Available 24/7',        staff: '❌ 8 hrs only',           platform: '✅ (their app)',    generic: '⚠️ Limited',    noeta: '✅ Always on' },
    { label: 'Takes Payments',        staff: '❌ No',                   platform: '✅ Their account', generic: '❌ No',          noeta: '✅ Your Razorpay' },
    { label: 'You Own Customer Data', staff: '⚠️ Sort of',             platform: '❌ They own it',   generic: '⚠️ Partial',    noeta: '✅ 100% yours' },
    { label: 'Industry-Specific AI',  staff: '⚠️ Human judgement',     platform: 'N/A',              generic: '❌ Generic',     noeta: '✅ Built for you' },
    { label: 'Lead Qualification',    staff: '⚠️ Manual, inconsistent',platform: 'N/A',              generic: '❌ No',          noeta: '✅ Automated' },
    { label: 'WhatsApp Reminders',    staff: '❌ Manually sent',        platform: '❌ No',            generic: '❌ No',          noeta: '✅ Automatic' },
    { label: 'Setup Time',            staff: '2–4 weeks hiring',        platform: '1–2 weeks review', generic: '3–6 weeks dev', noeta: '✅ 15 minutes' },
    { label: 'Zero-Commission Orders',staff: '✅ Yes',                  platform: '❌ Always 25–30%', generic: '✅ Yes',         noeta: '✅ Yes' },
  ];

  function classify(val) {
    if (val.startsWith('✅')) return 'cell-yes';
    if (val.startsWith('❌')) return 'cell-no';
    if (val.startsWith('⚠️')) return 'cell-warn';
    return '';
  }

  return (
    <section className="section">
      <div className="container">
        <div className="text-center reveal">
          <span className="label">How We Compare</span>
          <h2 className="h2">Noeta vs. Every Alternative<br />You're Considering</h2>
          <p className="lead" style={{ maxWidth: 540, margin: '16px auto 0' }}>
            Hiring staff, going on platforms, or buying a generic chatbot — none of them solve the actual problem.
          </p>
        </div>
        <div className="compare-table-wrap reveal">
          <table className="compare-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Feature</th>
                <th>Hiring WhatsApp Staff</th>
                <th>Zomato / Swiggy</th>
                <th>Generic Chatbot</th>
                <th className="highlight-col">⚡ Noeta</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.label}>
                  <td>{r.label}</td>
                  <td className={classify(r.staff)}>{r.staff}</td>
                  <td className={classify(r.platform)}>{r.platform}</td>
                  <td className={classify(r.generic)}>{r.generic}</td>
                  <td className={`col-noeta ${classify(r.noeta)}`} style={{ fontWeight: 700 }}>{r.noeta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center reveal" style={{ marginTop: 36 }}>
          <button className="btn btn-wa btn-lg" onClick={onSignup}>
            💬 Start Free — See it for Yourself →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Who Is Noeta For ─── */
function WhoIsItFor({ onSignup }) {
  return (
    <section className="section section-alt">
      <div className="container text-center">
        <span className="label">Is This For You?</span>
        <h2 className="h2 reveal">We're going to be honest<br />about who Noeta is built for</h2>
        <p className="lead reveal" style={{ maxWidth: 540, margin: '16px auto 0' }}>
          Noeta isn't for everyone. Here's exactly who will get maximum value — and who won't.
        </p>
        <div className="who-grid reveal">
          <div className="who-card for">
            <div className="who-card-title">✅ Noeta is perfect for you if…</div>
            <ul className="who-list">
              {[
                'You get 10+ WhatsApp messages per day that you can\'t always answer instantly',
                'You\'re paying 25–30% commission to platforms and want your margin back',
                'Your staff wastes hours daily answering the same repetitive questions',
                'You\'re losing business because customers message after hours',
                'You run a restaurant, salon, clinic, e-commerce or real estate business',
                'You want payments, bookings, and orders handled without picking up the phone',
              ].map(t => (
                <li key={t} className="who-item">
                  <span className="who-item-dot for">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="who-card not">
            <div className="who-card-title">⚠️ Noeta might not be right if…</div>
            <ul className="who-list">
              {[
                'You only get 2–3 WhatsApp messages a week (not worth automating yet)',
                'You want a human to personally handle every single conversation',
                'You don\'t have a WhatsApp Business number or haven\'t set one up',
                'You need a completely custom-built enterprise solution with full-stack dev',
                'Your business is in a country where WhatsApp isn\'t the primary channel',
              ].map(t => (
                <li key={t} className="who-item">
                  <span className="who-item-dot not">✗</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="reveal" style={{ marginTop: 32 }}>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: 'var(--fg)' }}>
            If you're in the left column — Noeta was built specifically for your business.
          </p>
          <button className="btn btn-primary btn-lg" onClick={onSignup}>
            Start My Free Trial →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Features (full grouped platform map — every capability) ─── */
const FEATURE_GROUPS = [
  {
    group: '🤖 AI Sales Agent', color: '#ede9fe',
    items: [
      { t: 'Llama 3.3 70B brain', d: 'Natural-language AI that knows your catalog, prices & policies — never loses context, never hallucinates.' },
      { t: 'Drive-to-close engine', d: 'Every reply ends with a next step — asks for the order, sends the link, isolates the blocker.' },
      { t: 'Multi-language', d: 'English, Hindi & Telugu — replies in the customer\'s language automatically.' },
      { t: 'Voice notes', d: 'Customers send a voice message — the bot understands and replies.' },
      { t: 'Image recognition', d: 'Customer sends a product photo or screenshot — the bot reads it and responds.' },
      { t: 'Rich product cards & carousel', d: 'Image + price + tappable "Order now" buttons; swipeable multi-product carousels.' },
    ],
  },
  {
    group: '🧠 AI Sales Intelligence (Deal Coach)', color: '#f5f3ff',
    items: [
      { t: 'Objection intelligence', d: 'Feel-Felt-Found playbook + auto-detects the real objection (price/trust/timing).' },
      { t: 'Pricing psychology', d: 'Anchoring, per-day framing, decoy/contrast, honest loss-aversion — built into every quote.' },
      { t: 'Negotiation closer', d: 'AI negotiates price within your discount ceiling — never gives away margin you didn\'t allow.' },
      { t: 'Upsell & bundles', d: 'Grows order value with catalog complements + real "bought-together" pairs.' },
      { t: 'Customer mind model', d: 'A persistent psychological profile per buyer — tone & offers personalised 1:1.' },
      { t: 'Emotion & sentiment', d: 'Reads frustration/anxiety/excitement per message and adapts tone live.' },
      { t: 'Predictive intelligence', d: 'Next-purchase, churn risk & lifetime value from order history.' },
      { t: 'Reactivation autopilot', d: 'Automatically wins back lapsed customers and credits recovered revenue.' },
      { t: 'Win/Loss intelligence', d: 'Tells you why deals are won or lost, categorised by reason.' },
      { t: 'Conversation scoring', d: 'Grades every chat 0–100, surfaces your weakest conversations and the gaps.' },
      { t: 'Competitor battlecards', d: 'Detects rival mentions, layers your positioning, tracks comeback rate.' },
      { t: 'Persuasion engine', d: 'Cialdini principles per buyer + a learning loop on what actually converts.' },
    ],
  },
  {
    group: '🎯 Lead Engine & Pipeline', color: '#dbeafe',
    items: [
      { t: 'Ad-report lead import', d: 'Upload your Meta/Google ads export — AI studies every lead and tells you who to chase.' },
      { t: 'Sales pipeline', d: 'Lead → Engaged → Discussing → Ordered → Won, with step-by-step conversion %.' },
      { t: 'Per-lead journey timeline', d: 'Price-asked → quote-sent → paid milestones for every contact.' },
      { t: '"Needs chasing" worklist', d: 'Surfaces quoted-but-cold leads, one-tap or bulk chase.' },
      { t: 'Expected-value forecast', d: 'Weighted pipeline — deal size × win-probability per lead.' },
      { t: 'Source ROI & true CAC', d: 'ROAS, cost-per-lead and cost-per-won by channel.' },
      { t: 'Revenue attribution', d: 'Which conversations and sources actually drove revenue (7/30/90-day).' },
      { t: 'Quotes tracking', d: 'Generate, send & track quotes — won/lost, with PDF.' },
      { t: 'Payment recovery', d: 'Auto-sweeps unpaid orders and resends payment links.' },
    ],
  },
  {
    group: '📣 Social Media Manager', color: '#fce7f3',
    items: [
      { t: 'One-click connect', d: 'Facebook, Instagram, LinkedIn, Pinterest, YouTube via official OAuth.' },
      { t: 'AI content generator', d: 'Turns a product/topic into captions + viral hashtags (optional AI image).' },
      { t: 'Multi-platform publishing', d: 'Post to every connected platform from one place.' },
      { t: 'Post scheduler', d: 'Plan a whole month — posts auto-publish at the chosen time.' },
    ],
  },
  {
    group: '🛒 Commerce & Operations', color: '#dcfce7',
    items: [
      { t: 'Products, variants & tiered pricing', d: 'Photos, options, add-ons and quantity/tier pricing.' },
      { t: 'Orders & Razorpay', d: 'Full lifecycle + payment links to your own Razorpay account.' },
      { t: 'GST invoices & statement', d: 'Auto GST e-invoices with your GSTIN + exportable GST report.' },
      { t: 'Stock management', d: 'Auto-deduct on payment, low-stock WhatsApp alerts.' },
      { t: 'Vendors & auto-reorder', d: 'AI reads vendor WhatsApp replies, extracts price/ETA, flags over-cost.' },
      { t: 'Coupons', d: 'CRUD, analytics, bulk CSV — redeemable right inside the chat.' },
      { t: 'Appointments & reminders', d: 'Per-staff slots, bookings, 24h reminders that cut no-shows ~60%.' },
      { t: 'Staff scheduling', d: 'Working days, hours & slot duration shown to customers live.' },
      { t: 'Google Sheets sync', d: 'Every order mirrored to your sheet in real time.' },
    ],
  },
  {
    group: '👋 Engagement & Follow-up', color: '#fef9c3',
    items: [
      { t: 'Bulk campaigns & templates', d: 'Broadcast to your list with rich templates + scheduling.' },
      { t: 'CRM & contacts', d: 'Every customer auto-saved; CSV import + WhatsApp number validation.' },
      { t: 'Follow-up drip', d: 'Automated multi-touch sequences after every order or enquiry.' },
      { t: 'AI smart follow-up', d: 'Writes a custom nudge from the lead\'s own conversation.' },
      { t: 'Re-engagement', d: 'Meta-compliant templates to re-open chats gone quiet >24h.' },
      { t: 'Live chat takeover', d: 'Jump in from the dashboard any time — full inbox.' },
    ],
  },
  {
    group: '🧑‍💼 Owner Tools & Admin', color: '#e0f2fe',
    items: [
      { t: 'Admin WhatsApp assistant', d: 'Run the business by texting your bot — quotes, stock, orders.' },
      { t: 'Dashboard AI assistant', d: 'Writes campaigns, builds audiences, answers ops questions, reads screenshots.' },
      { t: 'Analytics & daily digest', d: 'Revenue, volume & conversion + a daily summary.' },
      { t: 'Team roles (RBAC)', d: 'Multiple users, role-based access, per-role dashboards & activity log.' },
      { t: 'Test bot simulator', d: 'Try your AI without a real WhatsApp number.' },
      { t: 'Credits wallet', d: 'Prepaid outbound credits — pay only for what you send.' },
    ],
  },
  {
    group: '🛡️ Platform, Security & Growth', color: '#f0fdf4',
    items: [
      { t: 'Multi-store & white-label', d: 'Run multiple locations/brands; brand it as your own (Enterprise).' },
      { t: 'Partner / reseller program', d: 'Sub-accounts + 25% recurring commission engine.' },
      { t: 'API access', d: 'Integrate Noeta with your own stack (Enterprise).' },
      { t: 'Bank-grade security', d: 'Audit logs, signed webhooks, rate-limiting, single-device sessions, RLS isolation.' },
      { t: 'Daily AWS S3 backups', d: 'All data exported daily, 90-day retention.' },
      { t: 'Multi-currency', d: 'INR · USD · GBP · AED · AUD with local pricing.' },
    ],
  },
];

function Features() {
  return (
    <section className="section" id="features">
      <div className="container text-center">
        <span className="label">The Complete Platform</span>
        <h2 className="h2 reveal">Not a chatbot.<br />A full WhatsApp growth team.</h2>
        <p className="lead reveal" style={{ maxWidth: 600, margin: '16px auto 0' }}>
          60+ tools across 8 categories — sales, intelligence, lead engine, social, ops and security.
          Features unlock by plan; the pricing table shows exactly what's in each.
        </p>
        {FEATURE_GROUPS.map(g => (
          <div key={g.group} className="reveal" style={{ marginTop: 44 }}>
            <h3 style={{
              fontSize: 18, fontWeight: 800, textAlign: 'left', marginBottom: 18,
              paddingBottom: 10, borderBottom: '1px solid var(--brd, #e5e7eb)',
            }}>{g.group} <span style={{ color: 'var(--sub)', fontWeight: 600, fontSize: 13 }}>· {g.items.length} tools</span></h3>
            <div className="features-grid" style={{ marginTop: 0 }}>
              {g.items.map(f => (
                <div key={f.t} className="feature-card">
                  <div className="feature-icon" style={{ background: 'rgba(124,58,237,.18)', color: '#c4b5fd', border: '1px solid rgba(165,180,252,.28)', fontSize: 15, width: 36, height: 36 }}>✓</div>
                  <h4>{f.t}</h4>
                  <p>{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── What's New ─── */
function WhatsNew() {
  const updates = [
    { badge: 'NEW', color: '#7c3aed', icon: '🛡️', title: 'Security & Audit System', desc: 'Every login tracked with IP, country, device and browser. Full payment audit trail — every step from order creation to confirmation logged.' },
    { badge: 'NEW', color: '#0ea5e9', icon: '💾', title: 'Daily Cloud Backup', desc: 'All your orders, contacts, transactions and conversations backed up daily to AWS S3. Download any client\'s full data history any time.' },
    { badge: 'NEW', color: '#059669', icon: '🧾', title: 'GST-Compliant Invoices', desc: 'Set your GSTIN and GST percentage once. Every WhatsApp invoice auto-calculates GST, shows subtotal and total separately. Fully compliant.' },
    { badge: 'NEW', color: '#f59e0b', icon: '🔔', title: 'Real-Time Notifications', desc: 'Instant bell notification and toast popup the moment a new order arrives or payment is confirmed — no refresh needed.' },
    { badge: 'NEW', color: '#6366f1', icon: '🔑', title: 'Per-Client Razorpay', desc: 'Each business can connect their own Razorpay account. Payments go directly to the business — zero intermediary, full control.' },
    { badge: 'NEW', color: '#ec4899', icon: '🤖', title: 'Test Bot Simulator', desc: 'Test your AI bot\'s responses directly from the dashboard — no real WhatsApp number needed. Simulate any customer conversation.' },
  ];
  return (
    <section className="section section-alt" id="updates">
      <div className="container">
        <div className="text-center reveal">
          <span className="label">Latest Updates</span>
          <h2 className="h2">Built for serious businesses.<br />Updated every week.</h2>
          <p className="lead reveal" style={{ maxWidth: 560, margin: '16px auto 0' }}>
            We ship new features constantly. Here's what's fresh — security, compliance, automation, and more.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginTop: 48 }}>
          {updates.map(u => (
            <div key={u.title} className="reveal" style={{
              background: 'var(--card, #fff)', border: '1px solid var(--brd, #e5e7eb)',
              borderRadius: 16, padding: '24px 24px', display: 'flex', gap: 16,
              boxShadow: '0 2px 12px rgba(0,0,0,.04)',
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${u.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>
                {u.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, background: u.color, color: '#fff',
                    padding: '2px 8px', borderRadius: 99, letterSpacing: '.06em' }}>{u.badge}</span>
                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{u.title}</h4>
                </div>
                <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.6, margin: 0 }}>{u.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Security & Trust ─── */
function SecurityTrust() {
  return (
    <section className="section" id="security">
      <div className="container">
        <div className="text-center reveal">
          <span className="label">Security & Compliance</span>
          <h2 className="h2">Bank-grade security.<br />Built-in compliance.</h2>
          <p className="lead" style={{ maxWidth: 540, margin: '16px auto 0' }}>
            Your customer data, payments and business records are protected at every level — from login to backup.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginTop: 48 }}>
          {[
            { icon: '🔐', title: 'IP & Device Tracking', desc: 'Every admin login recorded with IP, country, city, device type and browser. Know exactly who accessed your account and when.' },
            { icon: '📋', title: 'Full Audit Trail', desc: 'Every settings change, plan upgrade, campaign sent and order update logged with timestamp and user. Full accountability.' },
            { icon: '💳', title: 'Payment Step Logs', desc: 'Every step of every payment — order created, link generated, webhook received, payment confirmed — logged with full details.' },
            { icon: '🚨', title: 'Suspicious Activity Alerts', desc: 'Login from a new country? 5 failed attempts? Super admin gets an instant email alert. Threats caught before damage is done.' },
            { icon: '📱', title: 'Single-Device Sessions', desc: 'Only one device logged in at a time. New login from another device invalidates the old session immediately.' },
            { icon: '💾', title: 'Daily AWS S3 Backups', desc: 'All tables — orders, contacts, transactions, campaigns — exported to S3 daily. 90 days retention.' },
            { icon: '🧱', title: 'Row-Level Security', desc: 'Supabase RLS ensures your data is completely isolated from other businesses. Not even a database admin can cross-read.' },
            { icon: '🧾', title: 'GST-Compliant Records', desc: 'Every invoice generated with GSTIN, GST amount and total. Tax records auto-maintained in your dashboard.' },
          ].map(s => (
            <div key={s.title} className="reveal" style={{
              background: 'var(--card, #fff)', border: '1px solid var(--brd, #e5e7eb)',
              borderRadius: 14, padding: '20px 20px',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{s.title}</h4>
              <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
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
const DEFAULT_PRICES = {
  IN: { Starter: 1499, Growth: 3999, Premium: 6999, Enterprise: 19999 },
  GB: { Starter: 15,   Growth: 39,   Premium: 79,   Enterprise: 239  },
  US: { Starter: 19,   Growth: 50,   Premium: 99,   Enterprise: 299  },
  AE: { Starter: 69,   Growth: 179,  Premium: 359,  Enterprise: 1099 },
  AU: { Starter: 29,   Growth: 75,   Premium: 149,  Enterprise: 449  },
};
const CUR_MAP = { IN:'INR', GB:'GBP', US:'USD', AE:'AED', AU:'AUD' };
const PLAN_DATA = [
  {
    id: 'starter', name: 'Starter', color: '#6366f1',
    prices: { IN: 1499, GB: 15, US: 19, AE: 69, AU: 29 },
    desc: 'Get your WhatsApp AI sales agent live and taking orders.',
    features: [
      { on: true,  text: 'WhatsApp AI sales agent' },
      { on: true,  text: 'Products, Orders & Razorpay' },
      { on: true,  text: 'GST invoices' },
      { on: true,  text: 'Basic analytics + ROI view' },
      { on: true,  text: '30 AI conversations/day' },
      { on: true,  text: 'Taste of Deal Coach (5/mo)' },
      { on: false, text: 'Multi-language (Hindi/Telugu)' },
      { on: false, text: 'Bulk campaigns & follow-up' },
      { on: false, text: 'Full Sales Intelligence' },
    ],
  },
  {
    id: 'growth', name: 'Growth', popular: true, color: '#4f46e5',
    prices: { IN: 3999, GB: 39, US: 50, AE: 179, AU: 75 },
    desc: 'Automate & scale — campaigns, follow-ups and multi-language.',
    features: [
      { on: true,  text: 'Everything in Starter' },
      { on: true,  text: 'Multi-language (Hindi/Telugu)' },
      { on: true,  text: 'Stock management + low-stock alerts' },
      { on: true,  text: 'Bulk campaigns & broadcasts' },
      { on: true,  text: 'Auto follow-up drip + AI nudges' },
      { on: true,  text: 'Product cards, voice & image AI' },
      { on: true,  text: '100 AI conversations/day' },
      { on: false, text: 'Full Sales Intelligence (unlimited)' },
      { on: false, text: 'Vendor auto-reorder & admin assistant' },
    ],
  },
  {
    id: 'premium', name: 'Premium', color: '#7c3aed',
    prices: { IN: 6999, GB: 79, US: 99, AE: 359, AU: 149 },
    desc: 'Full AI sales intelligence that closes deals and coaches you.',
    features: [
      { on: true, text: 'Everything in Growth' },
      { on: true, text: 'Deal Coach + revenue attribution' },
      { on: true, text: 'Battlecards, pricing psychology, scoring' },
      { on: true, text: 'Bulk lead import (ad-lead AI study)' },
      { on: true, text: 'Lead pipeline, quotes & payment recovery' },
      { on: true, text: 'Vendor & auto-reorder' },
      { on: true, text: 'Admin WhatsApp assistant + digest' },
      { on: true, text: '200 AI conversations/day' },
      { on: true, text: 'Priority support' },
    ],
  },
  {
    id: 'enterprise', name: 'Enterprise', color: '#0ea5e9', custom: true,
    prices: { IN: 19999, GB: 239, US: 299, AE: 1099, AU: 449 },
    desc: 'Multi-store, agencies & resellers — built to scale.',
    features: [
      { on: true, text: 'Everything in Premium' },
      { on: true, text: 'Multi-store / multi-location' },
      { on: true, text: 'Partner sub-accounts (resell)' },
      { on: true, text: 'API access & integrations' },
      { on: true, text: 'White-label branding' },
      { on: true, text: 'Dedicated manager + SLA' },
      { on: true, text: '600+ AI conversations/day' },
    ],
  },
];

function Pricing({ onSignup, livePrices }) {
  const [period, setPeriod] = useState('annual');   // push annual by default
  const [cur, setCur] = useState('IN');
  const symObj = CURRENCIES.find(c => c.code === cur);
  const sym = symObj?.sym || '₹';
  const PERIOD_MONTHS = { monthly: 1, quarterly: 3, half_yearly: 6, annual: 10 };
  const PERIOD_SUFFIX = { monthly: 'month', quarterly: 'quarter', half_yearly: '6 months', annual: 'year' };

  // Default currency to the visitor's region via timezone (no network; India-first fallback).
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const hit = [
        [/Kolkata|Calcutta/i, 'IN'], [/London/i, 'GB'], [/Dubai/i, 'AE'],
        [/Australia\//i, 'AU'], [/America\/|US\/|Canada\//i, 'US'],
      ].find(([re]) => re.test(tz));
      if (hit) setCur(hit[1]);
    } catch { /* keep IN default */ }
  }, []);

  function getBase(planName) {
    const backendKey = CUR_MAP[cur] || 'INR';
    return livePrices?.[backendKey]?.[planName] ?? DEFAULT_PRICES[cur]?.[planName] ?? DEFAULT_PRICES['IN'][planName];
  }

  return (
    <section className="section section-alt" id="pricing">
      <div className="container text-center">
        <span className="label">Pricing</span>
        <h2 className="h2 reveal">Simple pricing.<br />Start free. Pay when you're convinced.</h2>
        <p className="lead reveal" style={{ maxWidth: 480, margin: '16px auto 12px' }}>
          Every plan starts with a 14-day free trial. No credit card. No risk. Cancel in 2 clicks.
        </p>

        <div className="urgency-strip reveal">
          <span className="urgency-strip-icon">⚡</span>
          <span className="urgency-strip-text">
            Introductory pricing — locked for businesses that sign up now. Prices subject to increase as we grow.
          </span>
        </div>

        <div className="currency-row reveal" style={{ marginBottom: 10 }}>
          {[['monthly','Monthly'],['quarterly','Quarterly'],['half_yearly','Half-Yearly'],['annual','Annual']].map(([val, label]) => (
            <button key={val} className={`currency-btn ${period === val ? 'active' : ''}`} onClick={() => setPeriod(val)}>
              {label}{val === 'annual' && <span className="save-badge" style={{ marginLeft: 6 }}>2 mo free</span>}
            </button>
          ))}
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
            const base     = getBase(p.name);
            const perMonth = period === 'annual' ? Math.round(base * 10 / 12) : base;
            const total    = base * PERIOD_MONTHS[period];
            return (
              <div key={p.id} className={`plan-card reveal ${p.popular ? 'popular' : ''}`}>
                {p.popular && <div className="popular-badge">⭐ Most Popular</div>}
                <div className="plan-name">{p.name}</div>
                <div className="plan-price">
                  {p.custom && <span style={{ fontSize: 14, color: 'var(--sub)', marginRight: 4 }}>from</span>}
                  <span className="plan-price-num">{sym}{perMonth}</span>
                  <span className="plan-price-period">/mo</span>
                </div>
                {period !== 'monthly' && !p.custom && (
                  <div style={{ fontSize: 12, color: 'var(--wa)', fontWeight: 600, marginBottom: 8 }}>
                    Billed {sym}{total}/{PERIOD_SUFFIX[period]}{period === 'annual' ? ' · 2 months free 🎉' : ''}
                  </div>
                )}
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
                  onClick={() => p.custom ? (window.location.href = 'mailto:rajeshtecky@gmail.com?subject=Enterprise%20Plan%20Enquiry') : onSignup(p.id)}>
                  {p.custom ? 'Contact Sales →' : p.popular ? `Start ${p.name} Free →` : `Get ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Risk Reversal */}
        <div className="risk-box reveal">
          <div className="risk-icon-wrap">🛡️</div>
          <div style={{ textAlign: 'left' }}>
            <div className="risk-title">The Noeta Guarantee — Zero Risk to Start</div>
            <ul className="risk-list">
              <li>14-day free trial — no credit card required, no commitment</li>
              <li>If you don't see impact in week 1, we'll set it up with you live on a call</li>
              <li>No contracts, no lock-in — cancel in 2 clicks from your dashboard</li>
              <li>We earn your business every month — keep it only as long as it pays for itself</li>
            </ul>
          </div>
        </div>

        <div className="reveal" style={{
          marginTop: 28, background: 'linear-gradient(135deg, rgba(37,211,102,.10), rgba(34,197,94,.04))',
          border: '1px solid rgba(37,211,102,.28)', borderRadius: 16, padding: '20px 24px',
          maxWidth: 680, marginLeft: 'auto', marginRight: 'auto', textAlign: 'left',
        }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 28, flexShrink: 0 }}>💬</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#6ee7b7', marginBottom: 6 }}>
                How WhatsApp charges work — no surprises
              </div>
              <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.72)', lineHeight: 1.7 }}>
                <strong>Your plan covers the AI agent platform — nothing more.</strong> When customers message
                you, Meta includes <strong>1,000 free service conversations per month</strong> and our bot replies
                instantly at zero extra cost.<br />
                Want to send bulk campaigns, appointment reminders, or payment links? Those use{' '}
                <strong>outbound credits — recharged separately</strong> as a prepaid wallet, so you only pay for
                what you actually send. No hidden inclusions, no surprises.
              </div>
            </div>
          </div>
        </div>
        <div className="reveal" style={{
          marginTop: 20, background: 'linear-gradient(135deg, rgba(124,58,237,.12), rgba(99,102,241,.05))',
          border: '1px solid rgba(124,58,237,.32)', borderRadius: 14, padding: '16px 20px',
          maxWidth: 680, marginLeft: 'auto', marginRight: 'auto', textAlign: 'left',
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 22 }}>🛠️</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#c4b5fd', marginBottom: 4 }}>
                One-time setup fee — <strong>waived on annual plans</strong> 🎉
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.72)', lineHeight: 1.7 }}>
                A one-time setup fee applies at signup — <strong>Starter ₹5,000 · Growth ₹10,000 · Premium ₹15,000 · Enterprise ₹50,000</strong> —
                covering onboarding, WhatsApp API guidance, bot configuration and priority first-week support.{' '}
                <strong>Pay annual and we waive the setup fee entirely</strong> — plus you get 2 months free. That's why annual is the smart choice.
              </div>
            </div>
          </div>
        </div>

        <div className="guarantee-badges reveal">
          {[
            { icon: '🔒', text: 'No credit card to start' },
            { icon: '✅', text: '14-day free trial' },
            { icon: '🔓', text: 'Cancel anytime' },
            { icon: '🌍', text: 'Works globally' },
          ].map(b => (
            <div key={b.text} className="g-badge">
              <span className="g-badge-icon">{b.icon}</span>
              {b.text}
            </div>
          ))}
        </div>

        <p className="reveal" style={{ marginTop: 16, fontSize: 13, color: 'var(--sub)' }}>
          All prices exclusive of applicable taxes · Razorpay for India · International cards accepted
        </p>
      </div>
    </section>
  );
}

/* ─── Testimonials (Case Study Format) ─── */
const TESTIS = [
  {
    before: ['₹40,000/mo to Zomato commissions', 'Zero direct customer database', 'Orders missed every evening after 9 PM'],
    after:  ['₹0 commission — 100% margin kept', '1,200 customers in own CRM in 90 days', '34 direct WhatsApp orders/day'],
    text: '"We were paying ₹40,000/month to Zomato. After switching to Noeta, our customers order directly on WhatsApp and we keep 100% of the revenue. Setup took less than 30 minutes."',
    name: 'Rajan Mehta', role: 'Owner, Spice Garden Restaurant, Mumbai', color: '#f97316', initials: 'RM',
  },
  {
    before: ['4 hrs/day receptionist time on calls', 'No-show rate at 33% (1 in 3 patients)', 'Manual confirmation calls every morning'],
    after:  ['Bot handles all bookings automatically', 'No-show rate dropped to 6%', '94% confirmation rate with 0 manual calls'],
    text: '"Our receptionist was spending 4 hours a day just booking appointments. Now the bot handles everything and she focuses on patients. No-shows dropped by 65%."',
    name: 'Dr. Priya Sharma', role: 'Founder, Wellness Clinic, Bangalore', color: '#06b6d4', initials: 'PS',
  },
  {
    before: ['Losing B2B deals from slow WhatsApp replies', 'Hours per day on manual quoting & follow-up', 'No order tracking system'],
    after:  ['Bot handles all initial qualification', 'Payment links sent in < 1 min automatically', '₹2.4L revenue collected this week alone'],
    text: '"I run a corporate gifting business and was losing B2B deals because I couldn\'t reply fast enough. Noeta bot handles initial inquiries and I only jump in for the final close."',
    name: 'Ahmed Al-Farsi', role: 'Director, Elite Corporate Gifts, Dubai', color: '#8b5cf6', initials: 'AA',
  },
  {
    before: ['Phone bookings taking 3 hrs/day', 'No-shows happening 1 in 4 appointments', 'No after-hours booking possible'],
    after:  ['80% of bookings now via WhatsApp', 'No-shows near zero — reminders working', 'Clients book at midnight, calendar full by morning'],
    text: '"Our salon in London books 80% of appointments through WhatsApp now. Clients love getting the reminder the day before — our no-shows went from 1 in 4 to almost zero."',
    name: 'Sophie Patel', role: 'Owner, Glow Salon, London', color: '#ec4899', initials: 'SP',
  },
  {
    before: ['Team\'s entire morning spent qualifying leads', '90% of inquiries were tyre-kickers', 'No pipeline visibility — losing hot leads'],
    after:  ['Bot auto-qualifies budget, type, location', '26% qualify rate — team only calls serious buyers', '14 agent hours saved per week'],
    text: '"Real estate lead qualification used to take our team\'s entire morning. Now the bot asks all the budget and preference questions automatically. We only call serious buyers."',
    name: 'Vikram Nair', role: 'Sales Head, Prime Properties, Hyderabad', color: '#22c55e', initials: 'VN',
  },
  {
    before: ['40% of orders arrived after 9 PM — all missed', 'No follow-up system for repeat customers', 'Manual order taking by phone every day'],
    after:  ['Woke up to confirmed orders every morning', 'Auto-follow-up sent after every purchase', 'Revenue up 38% in first 60 days'],
    text: '"Noeta\'s analytics showed us 40% of our messages came after 9 PM. Now the bot handles those and we wake up to confirmed orders every morning. Complete game changer."',
    name: 'Lakshmi Reddy', role: 'Owner, Sweet Bloom Bakery, Chennai', color: '#f59e0b', initials: 'LR',
  },
];

function Testimonials() {
  return (
    <section className="section" id="testimonials">
      <div className="container text-center">
        <span className="label">How It Plays Out</span>
        <h2 className="h2 reveal">What changes when<br />Noeta runs your WhatsApp.</h2>
        <p className="lead reveal" style={{ maxWidth: 560, margin: '16px auto 0' }}>
          Representative before-and-after scenarios across the industries Noeta is built for —
          illustrating the kind of impact the platform is designed to deliver.
        </p>
        <div className="testimonials-grid" style={{ marginTop: 48 }}>
          {TESTIS.map(t => (
            <div key={t.name} className="case-study-card reveal">
              <div className="case-study-before-after">
                <div className="case-study-col before">
                  <div className="case-study-col-label">❌ Before Noeta</div>
                  {t.before.map(b => <div key={b} className="case-study-metric">{b}</div>)}
                </div>
                <div className="case-study-col after">
                  <div className="case-study-col-label">✅ After Noeta</div>
                  {t.after.map(a => <div key={a} className="case-study-metric">{a}</div>)}
                </div>
              </div>
              <div className="case-study-quote">
                {t.text}
              </div>
              <div className="case-study-footer">
                <div className="testi-avatar" style={{ background: t.color, width: 40, height: 40, fontSize: 16 }}>{t.initials}</div>
                <div style={{ textAlign: 'left' }}>
                  <div className="testi-name">{t.role}</div>
                  <div className="testi-role" style={{ fontStyle: 'italic', opacity: .75 }}>Illustrative scenario</div>
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
  { q: 'Do I need a WhatsApp Business API account?', a: 'Yes — Noeta uses the official WhatsApp Business API (not the regular app). We\'ll guide you through the application process, which typically takes 1–3 business days for approval. We\'ll help you every step of the way.' },
  { q: 'Will this work for my existing WhatsApp number?', a: 'Yes, you can use your existing WhatsApp Business number. Note: once connected to the API, the number can no longer be used with the regular WhatsApp app on a phone — but you\'ll have a full web dashboard instead.' },
  { q: 'What if my customers aren\'t used to chatting with a bot?', a: 'Most customers never realise they\'re talking to a bot — the AI is conversational, responds naturally, and handles your specific products and services. If a customer ever asks, the bot can transparently say it\'s an AI assistant. In practice, 90%+ of interactions are completed fully by the bot.' },
  { q: 'What if the bot gives wrong information?', a: 'The bot only responds based on what you\'ve configured — your products, prices, hours, services, and FAQs. It doesn\'t hallucinate or invent information. You can test it thoroughly using our Test Bot Simulator before going live, and update the knowledge base any time from your dashboard.' },
  { q: 'I tried chatbots before and they didn\'t work.', a: 'Most chatbot failures are because the bot was too rigid (keyword matching) or too generic (not trained for your business). Noeta uses Llama 3.3 70B AI that understands natural language, knows your specific catalog, and is built for your industry — restaurant, salon, clinic, real estate, or e-commerce. It\'s not a flowchart bot.' },
  { q: 'Will I lose the personal touch with my customers?', a: 'Actually, you gain it. The bot handles the transactional stuff — booking confirmations, order details, payment links. You and your team are freed up to focus on the actual human relationship — the greeting, the service, the follow-up call that matters. Automation handles the admin; you keep the connection.' },
  { q: 'What countries does Noeta support?', a: 'Noeta works globally. We\'re particularly popular in India 🇮🇳, UK 🇬🇧, USA 🇺🇸, UAE 🇦🇪 and Australia 🇦🇺. Payments supported in INR, GBP, USD, AED and AUD.' },
  { q: 'How does the AI bot handle complex questions?', a: 'The bot is powered by Llama 3.3 70B and knows your specific products, prices, staff, and business details. For truly complex queries it can transfer to a human. It handles 90%+ of messages automatically.' },
  { q: 'Is my customer data secure?', a: 'Yes. Noeta uses Supabase with Row Level Security — your data is completely isolated from other businesses. We never share or sell customer data. All communication is encrypted in transit.' },
  { q: 'Can I try before I pay?', a: 'Yes — every plan comes with a 14-day free trial. No credit card required to start. You pay only after you\'ve seen the bot working for your business.' },
  { q: 'My business is too small for this — is it worth it?', a: 'If you get 10+ WhatsApp messages per day, Noeta pays for itself in the first week. From ₹1,499/month (~₹50/day), you need the bot to save just one booking, one missed order, or 30 minutes of staff time daily to break even. Most businesses see 10–20x that return within the first month.' },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="section section-alt" id="faq">
      <div className="container text-center">
        <span className="label">FAQ</span>
        <h2 className="h2 reveal">Every question you have.<br />Answered honestly.</h2>
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
        <p className="lead reveal" style={{ color: 'rgba(255,255,255,.65)', maxWidth: 560, margin: '0 auto 16px' }}>
          Every day without Noeta is revenue left on the table, customers going unanswered, and margins paid to platforms. Be the business that wakes up to a full inbox of confirmed orders.
        </p>
        <p className="reveal" style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', maxWidth: 460, margin: '0 auto 36px' }}>
          Takes 15 minutes to set up. Free for 14 days. No credit card.
        </p>
        <div className="flex justify-center gap-4 flex-wrap reveal">
          <button className="btn btn-wa btn-lg" onClick={() => onSignup()}>
            <span>💬</span> Start Free — 14 Days, No Card
          </button>
          <a href="#roi" className="btn btn-outline btn-lg">Calculate My ROI First →</a>
        </div>
        <div className="guarantee-badges reveal" style={{ marginTop: 28, justifyContent: 'center' }}>
          {[
            { icon: '🔒', text: 'No credit card' },
            { icon: '⚡', text: 'Live in 15 min' },
            { icon: '🔓', text: 'Cancel anytime' },
            { icon: '🛡️', text: 'Risk-free trial' },
          ].map(b => (
            <div key={b.text} className="g-badge" style={{ background: 'rgba(255,255,255,.08)', borderColor: 'rgba(255,255,255,.15)', color: 'rgba(255,255,255,.7)' }}>
              <span className="g-badge-icon">{b.icon}</span>
              {b.text}
            </div>
          ))}
        </div>
        <p className="reveal" style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,.3)' }}>
          🇮🇳 India · 🇬🇧 UK · 🇺🇸 USA · 🇦🇪 UAE · 🇦🇺 Australia
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
              <div className="footer-brand-name">Noeta</div>
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
          <span className="footer-copy">© 2026 Noeta · Technology by DDC · All rights reserved.</span>
          <div className="footer-flags">🇮🇳 🇬🇧 🇺🇸 🇦🇪 🇦🇺</div>
          <span className="footer-copy">Powered by WhatsApp Business API · Razorpay · Supabase · Groq AI</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Spotlight: AI Sales Intelligence (the moat) ─── */
function SalesIntelligence({ onSignup }) {
  const engines = [
    { icon: '🛡️', title: 'Handles objections', desc: '"Too expensive", "need to think", "send me details" — the bot reframes and keeps the deal alive.' },
    { icon: '💰', title: 'Prices to convert', desc: 'Anchors high, breaks big numbers into per-day, shows the saving — never just blurts a number.' },
    { icon: '🤝', title: 'Negotiates safely', desc: 'Closes on price within the discount ceiling YOU set. It never gives away margin you didn\'t allow.' },
    { icon: '📈', title: 'Upsells every cart', desc: 'Attaches the right add-on from your catalog + real "bought-together" pairs — bigger orders, automatically.' },
    { icon: '🧠', title: 'Reads the buyer', desc: 'A mind-model + live sentiment per customer — tone, framing and offers tuned 1:1.' },
    { icon: '🔁', title: 'Wins back the lapsed', desc: 'Predicts churn and reactivates dormant buyers — and credits the revenue it recovers.' },
    { icon: '🏆', title: 'Tells you why you won/lost', desc: 'Mines wins & losses into clear reasons — price, trust, timing, competitor.' },
    { icon: '⚔️', title: 'Beats competitors', desc: 'Detects rivals by name, deploys your positioning, tracks how often you win the comparison.' },
  ];
  return (
    <section className="section" id="sales-intelligence">
      <div className="container text-center">
        <span className="label">The Difference</span>
        <h2 className="h2 reveal">Most bots reply.<br /><span className="gradient-text">Noeta actually closes.</span></h2>
        <p className="lead reveal" style={{ maxWidth: 620, margin: '16px auto 0' }}>
          Under the hood is <strong>Deal Coach</strong> — 13 AI sales engines that work like your best
          salesperson and your sales manager at the same time. This is what you pay a human closer for.
        </p>
        <div className="features-grid" style={{ marginTop: 44 }}>
          {engines.map(e => (
            <div key={e.title} className="feature-card reveal" style={{ textAlign: 'left' }}>
              <div className="feature-icon">{e.icon}</div>
              <h4>{e.title}</h4>
              <p>{e.desc}</p>
            </div>
          ))}
        </div>
        <div className="reveal" style={{ marginTop: 32 }}>
          <button className="btn btn-primary btn-lg" onClick={onSignup}>See Deal Coach in action →</button>
          <p style={{ fontSize: 13, color: 'var(--sub)', marginTop: 12 }}>
            Plus conversation scoring, persuasion learning-loop & full revenue attribution — included on Premium.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Spotlight: Lead Engine (ad-report import hero) ─── */
function LeadEngine({ onSignup }) {
  const steps = [
    { n: '1', icon: '📤', title: 'Upload your ad report', desc: 'Export your leads from Meta / Google / any CSV and drop it in — up to 2,000 rows.' },
    { n: '2', icon: '🔬', title: 'AI studies every lead', desc: 'It reads each one like a sales expert — likely blocker, buying score, the exact next step.' },
    { n: '3', icon: '💬', title: 'It chases the money', desc: 'Auto-starts WhatsApp follow-up, ranks your pipeline by ₹ at stake, and flags who\'s going cold.' },
  ];
  return (
    <section className="section section-alt" id="lead-engine">
      <div className="container">
        <div className="text-center reveal">
          <span className="label">Lead Engine</span>
          <h2 className="h2">You're paying for ad clicks.<br />Noeta turns them into closed orders.</h2>
          <p className="lead" style={{ maxWidth: 600, margin: '16px auto 0' }}>
            Stop dumping leads into a spreadsheet that nobody works. Upload the report — the AI studies,
            scores, follows up and forecasts revenue for every single lead.
          </p>
        </div>
        <div className="steps reveal" style={{ marginTop: 44 }}>
          {steps.map(s => (
            <div key={s.n} className="step">
              <div className="step-num">{s.n}</div>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="reveal" style={{
          marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14, maxWidth: 860, margin: '36px auto 0',
        }}>
          {[
            ['🎯', 'Weighted pipeline', 'Deal size × win-probability per lead'],
            ['📊', 'Source ROI & true CAC', 'ROAS + cost-per-won by channel'],
            ['🧭', 'Per-lead journey', 'Price-asked → quote → paid timeline'],
            ['🔔', 'Needs-chasing worklist', 'Quoted-but-cold leads, one-tap chase'],
          ].map(([i, t, d]) => (
            <div key={t} style={{ background: 'var(--card,#fff)', border: '1px solid var(--brd,#e5e7eb)', borderRadius: 14, padding: '18px 16px', textAlign: 'left' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{i}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{t}</div>
              <div style={{ fontSize: 12.5, color: 'var(--sub)', lineHeight: 1.6 }}>{d}</div>
            </div>
          ))}
        </div>
        <div className="text-center reveal" style={{ marginTop: 36 }}>
          <button className="btn btn-wa btn-lg" onClick={onSignup}>💬 Put my ad leads to work →</button>
        </div>
      </div>
    </section>
  );
}

/* ─── Spotlight: Social Media Manager ─── */
function SocialManager({ onSignup }) {
  return (
    <section className="section" id="social">
      <div className="container">
        <div className="text-center reveal">
          <span className="label">Built-in Social Media Manager</span>
          <h2 className="h2">Your storefront sells.<br />Your social media fills it.</h2>
          <p className="lead" style={{ maxWidth: 600, margin: '16px auto 0' }}>
            Noeta isn't only WhatsApp. Connect your channels, let AI write the posts, and schedule a
            whole month — all from the same dashboard. One subscription, two growth engines.
          </p>
        </div>
        <div className="features-grid reveal" style={{ marginTop: 44 }}>
          {[
            { icon: '🔗', title: 'Connect everything', desc: 'Facebook, Instagram, LinkedIn, Pinterest & YouTube via official one-click OAuth.' },
            { icon: '✍️', title: 'AI writes the post', desc: 'Give it a product or topic — get a ready caption + viral hashtags, optionally an AI image.' },
            { icon: '🚀', title: 'Publish everywhere', desc: 'Fan one post out to every connected platform in a tap.' },
            { icon: '📅', title: 'Schedule a month', desc: 'Queue posts and let them auto-publish at the perfect time — set it and forget it.' },
          ].map(f => (
            <div key={f.title} className="feature-card" style={{ textAlign: 'left' }}>
              <div className="feature-icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center reveal" style={{ marginTop: 32 }}>
          <button className="btn btn-primary btn-lg" onClick={onSignup}>Start posting on autopilot →</button>
        </div>
      </div>
    </section>
  );
}

/* ─── App ─── */
export default function App() {
  const [showSignup,  setShowSignup]  = useState(false);
  const [showLogin,   setShowLogin]   = useState(false);
  const [defaultPlan, setDefaultPlan] = useState('growth');
  const [livePrices,  setLivePrices]  = useState(null);
  useReveal();
  useParallax();

  useEffect(() => {
    const BACKEND = import.meta.env.VITE_BACKEND_URL || '';
    if (BACKEND) {
      fetch(`${BACKEND}/api/plan-prices`)
        .then(r => r.json())
        .then(d => { if (d?.INR) setLivePrices(d); })
        .catch(() => {});
    }
  }, []);

  function openSignup(plan) {
    setDefaultPlan(plan || 'growth');
    setShowSignup(true);
    setShowLogin(false);
  }

  function openLogin() {
    setShowLogin(true);
    setShowSignup(false);
  }

  return (
    <>
      <Nav onSignup={() => openSignup()} onLogin={openLogin} />
      <Hero onSignup={() => openSignup()} />
      <LiveDemo />
      <StatInterrupt />
      <ProofBar />
      <TrustBar />
      <BentoResults />
      <Problem />
      <DayComparison onSignup={() => openSignup()} />
      <SalesIntelligence onSignup={() => openSignup()} />
      <LeadEngine onSignup={() => openSignup()} />
      <HowItWorks onSignup={() => openSignup()} />
      <ROICalculator onSignup={() => openSignup()} />
      <Industries onSignup={openSignup} />
      <SocialManager onSignup={() => openSignup()} />
      <ComparisonTable onSignup={() => openSignup()} />
      <WhoIsItFor onSignup={() => openSignup()} />
      <Features />
      <WhatsNew />
      <SecurityTrust />
      <Pricing onSignup={openSignup} livePrices={livePrices} />
      <Testimonials />
      <FAQ />
      <CTASection onSignup={openSignup} />
      <Footer />
      <StickyMobileCTA onSignup={() => openSignup()} />
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} defaultPlan={defaultPlan} />}
      {showLogin  && <LoginModal  onClose={() => setShowLogin(false)} />}
    </>
  );
}
