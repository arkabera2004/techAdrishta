// src/pages/Register.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, CheckCircle, ChevronDown } from 'lucide-react';
import { events } from '../data/events';
import upiQr from '../assets/upi-qr.jpg';

/* ─── Constants (mirrors FEST / register.tsx) ─── */
const UPI_ID            = 'techadrishta@upi';
const SMIT_DOMAIN       = '@smit.smu.edu.in';
const STEPS             = ['Your details', 'Pay via UPI', 'Transaction ID', 'Confirmed'];
const SMIT_STEPS        = ['Your details', 'SMIT waiver', 'Confirmed'];

/* ─── Helpers ─── */
function formatPrice(price) {
  return price === 0 ? 'Free' : `₹${price}`;
}
function genRegId() {
  return 'TA-' + Math.random().toString(36).slice(2, 8).toUpperCase() + '-2026';
}

/* ─── Validation (mirrors zod schemas) ─── */
function validateDetails(form) {
  const errs = {};
  if (!form.full_name.trim() || form.full_name.trim().length < 2)
    errs.full_name = 'Enter your full name';
  if (!form.email.trim().includes('@'))
    errs.email = 'Enter a valid email';
  else if (form.is_smit_student && !form.email.toLowerCase().endsWith(SMIT_DOMAIN))
    errs.email = `Use your SMIT email ending in ${SMIT_DOMAIN}`;
  if (form.phone.trim().length < 8)
    errs.phone = 'Enter a valid phone number';
  if (!form.event_id)
    errs.event_id = 'Pick an event';
  return errs;
}
function validateUtr(utr) {
  if (!utr.trim() || utr.trim().length < 6)
    return 'Enter the UTR / transaction reference';
  return null;
}

/* ─── Page ─── */
export default function Register() {
  const [searchParams]    = useSearchParams();
  const preselectedId     = searchParams.get('event') ?? '';

  const [step,       setStep]       = useState(0);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [regId,      setRegId]      = useState(null);
  const [slideIn,    setSlideIn]    = useState(false);
  const [toastMsg,   setToastMsg]   = useState(null);  // { text, ok }
  const [copied,     setCopied]     = useState(false);

  const [form, setForm] = useState({
    full_name:          '',
    email:              '',
    phone:              '',
    college_or_company: '',
    event_id:           preselectedId,
    utr_number:         '',
    is_smit_student:    false,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const selected    = events.find(e => e.id === form.event_id);
  const amount      = Number(selected?.price ?? 0);
  const amountDue   = form.is_smit_student ? 0 : amount;
  const steps       = form.is_smit_student ? SMIT_STEPS : STEPS;
  const displayedStep = form.is_smit_student && step === 3 ? 2 : step;

  /* Slide-down animation when arriving from a ticket tear */
  useEffect(() => {
    if (sessionStorage.getItem('ticket-register-slide') !== '1') return;
    sessionStorage.removeItem('ticket-register-slide');
    setSlideIn(true);
    const t = setTimeout(() => setSlideIn(false), 700);
    return () => clearTimeout(t);
  }, []);

  /* Auto-dismiss toast */
  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 3200);
    return () => clearTimeout(t);
  }, [toastMsg]);

  /* Simulate DB insert (replace with real API call) */
  async function createRegistration({ status, utrNumber }) {
    await new Promise(r => setTimeout(r, 650));   // simulate network
    const id = genRegId();
    setRegId(id);
    setStep(3);
    return id;
  }

  /* Step 0 → continue */
  async function nextFromDetails() {
    const errs = validateDetails(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    if (form.is_smit_student) {
      setSubmitting(true);
      try {
        await createRegistration({ status: 'smit_free' });
        setToastMsg({ text: 'SMIT student pass confirmed ✓', ok: true });
      } catch {
        setToastMsg({ text: 'Something went wrong', ok: false });
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setStep(1);
  }

  /* Step 2 → submit UTR */
  async function submit() {
    const err = validateUtr(form.utr_number);
    if (err) { setErrors({ utr_number: err }); return; }
    setErrors({});
    setSubmitting(true);
    try {
      await createRegistration({ status: 'pending', utrNumber: form.utr_number.trim() });
      setToastMsg({ text: 'Registration submitted — pending verification', ok: true });
    } catch {
      setToastMsg({ text: 'Something went wrong', ok: false });
    } finally {
      setSubmitting(false);
    }
  }

  function copyUpi() {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      setToastMsg({ text: 'UPI ID copied', ok: true });
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <main style={styles.page}>
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            style={{ ...styles.toast, background: toastMsg.ok ? '#10b981' : '#ef4444' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {toastMsg.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          ...styles.container,
          animation: slideIn ? 'slideDown 0.7s cubic-bezier(0.22,0.8,0.24,1) both' : 'none',
        }}
      >
        {/* ── Title ── */}
        <h1 style={styles.title}>
          Get your <span style={styles.gradient}>pass</span>
        </h1>

        {/* ── Step indicators ── */}
        <div style={styles.stepRow}>
          {steps.map((s, i) => (
            <div
              key={s}
              style={{
                ...styles.stepPill,
                background: i <= displayedStep
                  ? 'linear-gradient(135deg, #8b5cf6, #d946ef)'
                  : 'rgba(255,255,255,0.07)',
                color: i <= displayedStep ? '#fff' : 'rgba(255,255,255,0.35)',
                border: i <= displayedStep
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {i < displayedStep && <Check size={11} style={{ flexShrink: 0 }} />}
              {s}
            </div>
          ))}
        </div>

        {/* ── Form card ── */}
        <div style={styles.card}>
          <AnimatePresence mode="wait">

            {/* ── Step 0: Your details ── */}
            {step === 0 && (
              <motion.div key="details" {...fade} style={styles.stepBody}>
                <Field id="full_name" label="Full name" error={errors.full_name}>
                  <input id="full_name" type="text" placeholder="Arjun Sharma"
                    value={form.full_name}
                    onChange={e => set('full_name', e.target.value)}
                    style={input(!!errors.full_name)} />
                </Field>

                <Field id="email" label="Email" error={errors.email}>
                  <input id="email" type="email" placeholder="you@smit.smu.edu.in"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    style={input(!!errors.email)} />
                  <p style={styles.hint}>SMIT students must register with their official {SMIT_DOMAIN} email.</p>
                </Field>

                <Field id="phone" label="Phone" error={errors.phone}>
                  <input id="phone" type="tel" placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    style={input(!!errors.phone)} />
                </Field>

                <Field id="org" label="College or company">
                  <input id="org" type="text" placeholder="IIT Bangalore / SMIT"
                    value={form.college_or_company}
                    onChange={e => set('college_or_company', e.target.value)}
                    style={input(false)} />
                </Field>

                <Field id="event_id" label="Event" error={errors.event_id}>
                  <div style={{ position: 'relative' }}>
                    <select id="event_id"
                      value={form.event_id}
                      onChange={e => set('event_id', e.target.value)}
                      style={{ ...input(!!errors.event_id), cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', paddingRight: '2.5rem' }}>
                      <option value="">Select an event…</option>
                      {events.map(ev => (
                        <option key={ev.id} value={ev.id}>
                          {ev.title} — {form.is_smit_student ? 'Free for SMIT students' : formatPrice(Number(ev.price))}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} color="#94a3b8" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </Field>

                {/* SMIT checkbox */}
                <label style={styles.smitLabel} htmlFor="is_smit">
                  <input id="is_smit" type="checkbox"
                    checked={form.is_smit_student}
                    onChange={e => set('is_smit_student', e.target.checked)}
                    style={styles.checkbox}
                  />
                  <span>
                    <span style={styles.smitBold}>I am a SMIT student</span>
                    <span style={styles.smitSub}>
                      Free registration for Sikkim Manipal Institute of Technology students
                      using an official {SMIT_DOMAIN} email ID.
                    </span>
                  </span>
                </label>

                {/* SMIT waiver notice */}
                {form.is_smit_student && selected && (
                  <div style={styles.waiverBanner}>
                    <strong style={{ color: '#fff' }}>{selected.title}</strong> is free for
                    SMIT students. Payment and UTR steps will be skipped.
                  </div>
                )}

                <button
                  type="button"
                  disabled={submitting}
                  onClick={nextFromDetails}
                  style={{ ...styles.primaryBtn, opacity: submitting ? 0.65 : 1 }}
                  id="reg-continue-btn"
                >
                  {submitting
                    ? 'Submitting…'
                    : form.is_smit_student
                      ? 'Confirm free SMIT pass'
                      : 'Continue to payment'}
                </button>
              </motion.div>
            )}

            {/* ── Step 1: Pay via UPI ── */}
            {step === 1 && (
              <motion.div key="pay" {...fade} style={{ ...styles.stepBody, alignItems: 'center', textAlign: 'center' }}>
                <p style={styles.amountLabel}>Amount due</p>
                <p style={styles.amountValue}>{formatPrice(amountDue)}</p>
                <p style={styles.eventName}>{selected?.title}</p>
                <div style={styles.qrWrap}>
                  <img src={upiQr} alt="UPI QR code for payment" style={styles.qrImg} />
                </div>
                <p style={styles.upiLine}>
                  UPI ID: <strong style={{ color: '#fff' }}>{UPI_ID}</strong>
                </p>
                <button type="button" onClick={copyUpi} style={styles.copyBtn} id="copy-upi-btn">
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy UPI ID'}
                </button>
                <div style={styles.btnRow}>
                  <button type="button" onClick={() => setStep(0)} style={styles.ghostBtn}>Back</button>
                  <button type="button" onClick={() => setStep(2)} style={styles.primaryBtn} id="paid-btn">
                    I've paid
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Transaction ID ── */}
            {step === 2 && (
              <motion.div key="utr" {...fade} style={styles.stepBody}>
                <Field id="utr_number" label="UTR / transaction ID" error={errors.utr_number}>
                  <input id="utr_number" type="text" placeholder="e.g. 318501234567"
                    value={form.utr_number}
                    onChange={e => set('utr_number', e.target.value)}
                    style={input(!!errors.utr_number)} />
                </Field>
                <p style={styles.hint}>
                  Find this in your UPI app after completing the payment.
                </p>
                <div style={styles.btnRow}>
                  <button type="button" onClick={() => setStep(1)} style={styles.ghostBtn}>Back</button>
                  <button type="button" disabled={submitting} onClick={submit}
                    style={{ ...styles.primaryBtn, opacity: submitting ? 0.65 : 1 }}
                    id="submit-registration-btn">
                    {submitting ? 'Submitting…' : 'Submit registration'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Confirmed ── */}
            {step === 3 && (
              <motion.div key="confirmed" {...fade} style={{ ...styles.stepBody, alignItems: 'center', textAlign: 'center', paddingTop: '0.5rem' }}>
                <div style={styles.checkWrap}>
                  <CheckCircle size={56} color="#10b981" strokeWidth={1.5} />
                </div>
                <h2 style={styles.confirmedTitle}>You're on the list</h2>
                <p style={styles.regIdLabel}>Registration ID</p>
                <code style={styles.regId}>{regId}</code>
                <p style={styles.statusBadge}>
                  Status: {form.is_smit_student ? 'SMIT free pass' : 'pending verification'}
                </p>
                <p style={styles.statusNote}>
                  {form.is_smit_student
                    ? 'Your SMIT student waiver has been recorded. Carry your student ID for entry verification.'
                    : 'We verify UPI payments within 24 hours and email your pass.'}
                </p>
                <Link to="/events" style={styles.browseLink} id="browse-events-link">
                  Browse more events →
                </Link>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

/* ─── Field wrapper ─── */
function Field({ id, label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label htmlFor={id} style={styles.fieldLabel}>{label}</label>
      {children}
      {error && <span style={styles.fieldError}>{error}</span>}
    </div>
  );
}

/* ─── Input style factory ─── */
function input(hasError) {
  return {
    display: 'block',
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.07)',
    border: `1px solid ${hasError ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
    color: '#fff',
    fontSize: '0.9375rem',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    appearance: 'none',
  };
}

const fade = {
  initial:    { opacity: 0, y: 10 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -10 },
  transition: { duration: 0.22 },
};

/* ─── Styles ─── */
const styles = {
  page: {
    paddingTop: '80px',
    minHeight: '100svh',
    position: 'relative',
  },

  /* Toast */
  toast: {
    position: 'fixed',
    top: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px 20px',
    borderRadius: '999px',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 600,
    zIndex: 9000,
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    whiteSpace: 'nowrap',
  },

  container: {
    maxWidth: '42rem',
    margin: '0 auto',
    padding: '3rem 1.25rem 6rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
  },

  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
    color: '#fff',
    lineHeight: 1.1,
  },
  gradient: {
    background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  /* Steps */
  stepRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  stepPill: {
    flex: 1,
    minWidth: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.375rem',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    textAlign: 'center',
    lineHeight: 1.3,
    transition: 'background 0.25s, color 0.25s',
  },

  /* Card */
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '1.5rem',
    padding: '1.75rem',
    backdropFilter: 'blur(16px)',
    overflow: 'hidden',
  },
  stepBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  /* Field */
  fieldLabel: {
    fontSize: '0.6875rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.45)',
  },
  fieldError: {
    fontSize: '0.75rem',
    color: '#ef4444',
  },
  hint: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.35)',
    lineHeight: 1.5,
    marginTop: '-0.25rem',
  },

  /* SMIT */
  smitLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '1rem',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    marginTop: '3px',
    accentColor: '#8b5cf6',
    cursor: 'pointer',
    flexShrink: 0,
  },
  smitBold: {
    display: 'block',
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '4px',
  },
  smitSub: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 1.5,
  },
  waiverBanner: {
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    background: 'rgba(16,185,129,0.12)',
    border: '1px solid rgba(16,185,129,0.25)',
    fontSize: '0.875rem',
    color: '#6ee7b7',
    lineHeight: 1.5,
  },

  /* Buttons */
  primaryBtn: {
    display: 'block',
    width: '100%',
    padding: '13px',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.9375rem',
    fontFamily: "'Space Grotesk', sans-serif",
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    letterSpacing: '0.02em',
  },
  ghostBtn: {
    flex: 1,
    padding: '13px',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.65)',
    fontWeight: 600,
    fontSize: '0.9375rem',
    fontFamily: "'Space Grotesk', sans-serif",
    cursor: 'pointer',
  },
  btnRow: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '0.25rem',
  },

  /* Payment */
  amountLabel: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)' },
  amountValue: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(2rem, 6vw, 2.75rem)',
    background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginTop: '-4px',
  },
  eventName: {
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.35)',
    marginTop: '-4px',
  },
  qrWrap: {
    width: '176px',
    height: '176px',
    background: '#fff',
    borderRadius: '16px',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
  },
  qrImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '8px',
  },
  upiLine: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.5)',
  },
  copyBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '7px 16px',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.65)',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  /* Confirmed */
  checkWrap: {
    width: '84px',
    height: '84px',
    borderRadius: '50%',
    background: 'rgba(16,185,129,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmedTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: '1.75rem',
    color: '#fff',
  },
  regIdLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginTop: '0.25rem',
  },
  regId: {
    fontFamily: 'ui-monospace, Consolas, monospace',
    fontSize: '1.0625rem',
    color: '#22d3ee',
    background: 'rgba(34,211,238,0.1)',
    padding: '5px 16px',
    borderRadius: '8px',
    letterSpacing: '0.08em',
  },
  statusBadge: {
    color: '#f59e0b',
    fontSize: '0.875rem',
    fontWeight: 700,
    marginTop: '0.25rem',
  },
  statusNote: {
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 1.65,
    maxWidth: '36ch',
  },
  browseLink: {
    display: 'inline-block',
    marginTop: '0.25rem',
    padding: '9px 20px',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.55)',
    fontSize: '0.875rem',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'border-color 0.2s, color 0.2s',
  },
};
