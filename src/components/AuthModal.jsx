import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X, Lock, User, Mail, Globe, Phone, FileText,
  CheckCircle2, ShieldCheck, ArrowLeft, RefreshCw, Sparkles
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   OTP Input – 6 individual digit boxes with auto-advance
   ───────────────────────────────────────────────────────────── */
function OtpInput({ value, onChange, error }) {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const digits = (value + '      ').slice(0, 6).split('');

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      const next = digits.map((d, idx) => (idx === i ? ' ' : d)).join('').trimEnd();
      onChange(next.replace(/ /g, ''));
      if (i > 0) refs[i - 1].current?.focus();
    }
  };

  const handleChange = (i, e) => {
    const ch = e.target.value.replace(/\D/g, '').slice(-1);
    const next = digits.map((d, idx) => (idx === i ? (ch || ' ') : d)).join('');
    onChange(next.replace(/ /g, ''));
    if (ch && i < 5) refs[i + 1].current?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    refs[focusIdx].current?.focus();
    e.preventDefault();
  };

  return (
    <div className="otp-boxes" onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className={`otp-box ${error ? 'otp-box--error' : ''} ${digits[i]?.trim() ? 'otp-box--filled' : ''}`}
          value={digits[i]?.trim() || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Countdown hook – counts down from `seconds`
   ───────────────────────────────────────────────────────────── */
function useCountdown(seconds, running) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (!running) return;
    setRemaining(seconds);
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [running, seconds]);
  return remaining;
}

/* ─────────────────────────────────────────────────────────────
   Main Modal
   ───────────────────────────────────────────────────────────── */
export default function AuthModal() {
  const {
    authModalOpen, setAuthModalOpen,
    authMode, setAuthMode,
    login, quickDemoLogin,
    initiateRegistration, confirmOtpAndRegister,
    generatedOtp
  } = useApp();

  // ── Login state ──
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // ── Registration multi-step state ──
  // step: 'form' | 'otp' | 'success'
  const [regStep, setRegStep] = useState('form');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');
  const [desc, setDesc] = useState('');
  const [isSeller, setIsSeller] = useState(false);

  // ── OTP state ──
  const [otpValue, setOtpValue] = useState('');
  const [devOtp, setDevOtp] = useState(''); // shown in the dev banner
  const [otpTimerRunning, setOtpTimerRunning] = useState(false);
  const remaining = useCountdown(120, otpTimerRunning);

  // ── Shared error / loading ──
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Registered username captured for success screen ──
  const [registeredName, setRegisteredName] = useState('');

  if (!authModalOpen) return null;

  // Reset modal on close
  const handleClose = () => {
    setAuthModalOpen(false);
    setRegStep('form');
    setErrorMsg('');
    setOtpValue('');
    setDevOtp('');
    setOtpTimerRunning(false);
    setLoginUser(''); setLoginPass('');
    setUsername(''); setEmail(''); setPassword('');
    setCountry('India'); setPhone(''); setDesc(''); setIsSeller(false);
  };

  /* ── Login ── */
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      const res = login(loginUser, loginPass);
      setLoading(false);
      if (!res.success) setErrorMsg(res.message);
    }, 500);
  };

  /* ── Step 1: Submit registration form → get OTP ── */
  const handleRegFormSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      const res = initiateRegistration({ username, email, password, country, phone, desc, isSeller });
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setDevOtp(res.otp); // surface in dev banner
        setOtpTimerRunning(true);
        setRegStep('otp');
      }
    }, 600);
  };

  /* ── Step 2: Verify OTP ── */
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      const res = confirmOtpAndRegister(otpValue);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.message);
        setOtpValue('');
      } else {
        setRegisteredName(res.user.username);
        setOtpTimerRunning(false);
        setRegStep('success');
      }
    }, 700);
  };

  /* ── Resend OTP ── */
  const handleResend = () => {
    const res = initiateRegistration({ username, email, password, country, phone, desc, isSeller });
    if (res.success) {
      setDevOtp(res.otp);
      setOtpTimerRunning(true);
      setOtpValue('');
      setErrorMsg('');
    }
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  /* ══════════════════ RENDER ══════════════════ */
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-card auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* Decorative gradient blob */}
        <div className="auth-blob" />

        {/* ── Header tabs ── */}
        <div className="modal-header">
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`package-tab-btn ${authMode === 'login' ? 'active' : ''}`}
              style={{ borderRadius: 'var(--radius-sm)', padding: '8px 16px' }}
              onClick={() => { setAuthMode('login'); setErrorMsg(''); setRegStep('form'); }}
            >
              Sign In
            </button>
            <button
              className={`package-tab-btn ${authMode === 'register' ? 'active' : ''}`}
              style={{ borderRadius: 'var(--radius-sm)', padding: '8px 16px' }}
              onClick={() => { setAuthMode('register'); setErrorMsg(''); setRegStep('form'); }}
            >
              Join Trust+
            </button>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* ── Error banner ── */}
        {errorMsg && (
          <div className="auth-error-banner">
            {errorMsg}
          </div>
        )}

        {/* ════════════ LOGIN ════════════ */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Username or Email</label>
              <div style={{ position: 'relative' }}>
                <input type="text" required placeholder="e.g. demo_buyer or demo_seller"
                  className="form-input" style={{ paddingLeft: '40px' }}
                  value={loginUser} onChange={(e) => setLoginUser(e.target.value)} />
                <User size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input type="password" required placeholder="••••••••"
                  className="form-input" style={{ paddingLeft: '40px' }}
                  value={loginPass} onChange={(e) => setLoginPass(e.target.value)} />
                <Lock size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
              </div>
            </div>
            <button type="submit" className="btn-submit" disabled={loading} style={{ marginTop: '12px' }}>
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '10px' }}>
                Quick 1-Click Demo Accounts:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button type="button" className="btn-outline"
                  style={{ fontSize: '0.8rem', padding: '8px 10px' }}
                  onClick={() => quickDemoLogin('buyer')}>
                  ⚡ Buyer Demo
                </button>
                <button type="button" className="btn-outline"
                  style={{ fontSize: '0.8rem', padding: '8px 10px' }}
                  onClick={() => quickDemoLogin('seller')}>
                  ⭐ Seller Demo
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ════════════ REGISTER – STEP 1: FORM ════════════ */}
        {authMode === 'register' && regStep === 'form' && (
          <form onSubmit={handleRegFormSubmit}>
            {/* Step indicator */}
            <div className="otp-steps">
              <div className="otp-step otp-step--active"><span>1</span><p>Account Info</p></div>
              <div className="otp-step-line" />
              <div className="otp-step"><span>2</span><p>Verify OTP</p></div>
              <div className="otp-step-line" />
              <div className="otp-step"><span>3</span><p>Done!</p></div>
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <input type="text" required placeholder="Pick a unique username"
                  className="form-input" style={{ paddingLeft: '40px' }}
                  value={username} onChange={(e) => setUsername(e.target.value)} />
                <User size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input type="email" required placeholder="name@company.com"
                  className="form-input" style={{ paddingLeft: '40px' }}
                  value={email} onChange={(e) => setEmail(e.target.value)} />
                <Mail size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input type="password" required placeholder="Create a strong password"
                  className="form-input" style={{ paddingLeft: '40px' }}
                  value={password} onChange={(e) => setPassword(e.target.value)} />
                <Lock size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <div style={{ position: 'relative' }}>
                <input type="text" required placeholder="e.g. India, USA, UK"
                  className="form-input" style={{ paddingLeft: '40px' }}
                  value={country} onChange={(e) => setCountry(e.target.value)} />
                <Globe size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Seller Toggle */}
            <div style={{ background: 'var(--bg-subtle)', padding: '14px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--dark)' }}>Activate Seller Account</span>
                <input type="checkbox" checked={isSeller} onChange={(e) => setIsSeller(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
              </label>
              {isSeller && (
                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Phone Number</label>
                    <input type="text" placeholder="+91 98765 43210"
                      className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Seller Bio</label>
                    <textarea rows={2} placeholder="Brief summary of your expertise…"
                      className="form-textarea" value={desc} onChange={(e) => setDesc(e.target.value)} />
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Sending OTP…' : 'Send Verification Code →'}
            </button>
          </form>
        )}

        {/* ════════════ REGISTER – STEP 2: OTP ════════════ */}
        {authMode === 'register' && regStep === 'otp' && (
          <form onSubmit={handleOtpSubmit}>
            {/* Step indicator */}
            <div className="otp-steps">
              <div className="otp-step otp-step--done"><span><CheckCircle2 size={14} /></span><p>Account Info</p></div>
              <div className="otp-step-line otp-step-line--done" />
              <div className="otp-step otp-step--active"><span>2</span><p>Verify OTP</p></div>
              <div className="otp-step-line" />
              <div className="otp-step"><span>3</span><p>Done!</p></div>
            </div>

            {/* Shield icon */}
            <div className="otp-shield">
              <ShieldCheck size={36} strokeWidth={1.5} />
            </div>

            <h3 style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: '700', marginBottom: '6px', color: 'var(--dark)' }}>
              Check your inbox
            </h3>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              We sent a 6-digit code to <strong>{email}</strong>
            </p>

            {/* DEV BANNER — shows the mock OTP so you can test it */}
            {devOtp && (
              <div className="otp-dev-banner">
                <span>🧪 Dev Mode — OTP:</span>
                <strong style={{ letterSpacing: '0.18em', fontSize: '1.1rem' }}>{devOtp}</strong>
              </div>
            )}

            <OtpInput value={otpValue} onChange={setOtpValue} error={!!errorMsg} />

            {/* Timer */}
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {remaining > 0 ? (
                <>Code expires in <strong style={{ color: remaining < 30 ? 'var(--danger)' : 'var(--primary)' }}>{fmt(remaining)}</strong></>
              ) : (
                <span style={{ color: 'var(--danger)' }}>Code expired.</span>
              )}
            </div>

            <button type="submit" className="btn-submit"
              disabled={loading || otpValue.length < 6}
              style={{ marginTop: '20px' }}>
              {loading ? 'Verifying…' : 'Verify & Create Account'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', alignItems: 'center' }}>
              <button type="button" className="otp-ghost-btn"
                onClick={() => { setRegStep('form'); setErrorMsg(''); setOtpValue(''); setOtpTimerRunning(false); }}>
                <ArrowLeft size={14} /> Back
              </button>
              <button type="button" className="otp-ghost-btn"
                disabled={remaining > 0} onClick={handleResend}>
                <RefreshCw size={14} /> Resend Code
              </button>
            </div>
          </form>
        )}

        {/* ════════════ REGISTER – STEP 3: SUCCESS ════════════ */}
        {authMode === 'register' && regStep === 'success' && (
          <div className="otp-success">
            <div className="otp-success__icon">
              <Sparkles size={28} />
            </div>
            <h2>Welcome, {registeredName}! 🎉</h2>
            <p>Your account has been verified and created successfully. You're now part of Trust+!</p>
            <button className="btn-submit" style={{ marginTop: '8px' }} onClick={handleClose}>
              Start Exploring →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
