// src/pages/Register.jsx
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, CheckCircle, ChevronDown } from 'lucide-react';
import { events as staticEvents } from '../data/events';
import { QRCodeSVG } from 'qrcode.react';
import { fetchEvents, registerForEvent, holdSeat, releaseHold } from '../lib/supabase';
import SwitchRulesCard from '../components/SwitchRulesCard';

/* ─── Constants (mirrors FEST / register.tsx) ─── */
const UPI_ID = 'thakurayush670@oksbi';
const SMIT_DOMAIN = '@smit.smu.edu.in';
const STEPS = ['Your details', 'Pay via UPI', 'Transaction ID', 'Confirmed'];
const SMIT_STEPS = ['Your details', 'SMIT waiver', 'Confirmed'];

/* ─── Helpers ─── */
function formatPrice(price) {
  return price === 0 ? 'Free' : `₹${price}`;
}
function genRegId() {
  return 'TA-' + Math.random().toString(36).slice(2, 8).toUpperCase() + '-2026';
}

/* ─── Validation (mirrors zod schemas) ─── */
function validateDetails(form, isTeamEvent, selectedEvent) {
  const errs = {};
  if (!form.full_name.trim() || form.full_name.trim().length < 2)
    errs.full_name = 'Enter your full name';
  if (!form.email.trim().includes('@'))
    errs.email = 'Enter a valid email';
  if (form.is_smit_student && !form.registration_no?.trim())
    errs.registration_no = 'Enter your registration number';
  if (!form.phone.trim() || form.phone.trim().length < 8)
    errs.phone = 'Enter a valid phone number';
  if (!form.college_or_company?.trim())
    errs.college_or_company = 'Enter your college name';
  if (!form.event_id)
    errs.event_id = 'Pick an event';

  if (isTeamEvent) {
    if (!form.team_name?.trim())
      errs.team_name = 'Enter your team name';

    if (selectedEvent) {
      const min = selectedEvent.min_team_size || 1;
      const max = selectedEvent.max_team_size || 5;
      if (!form.team_size || form.team_size < min || form.team_size > max) {
        errs.team_size = `Team size must be between ${min} and ${max}`;
      } else {
        const missingMembers = form.team_members.some(m => !m.name.trim() || !m.email.trim() || !m.phone.trim());
        if (missingMembers) {
          errs.team_members = 'Please fill all member details for your team size';
        }
      }
    }
  }

  if (form.accommodation) {
    if (!form.accommodation_days || form.accommodation_days < 1) {
      errs.accommodation_days = 'Enter valid number of days';
    }
    if (isTeamEvent) {
      const totalPeople = (form.male_count || 0) + (form.female_count || 0);
      if (totalPeople < 1) {
        errs.accommodation_counts = 'Specify at least 1 person for accommodation';
      }
      if (totalPeople > (form.team_size || 5)) {
        errs.accommodation_counts = 'Accommodation count cannot exceed team size';
      }
    }
  }
  return errs;
}
function validateUtr(utr) {
  if (!utr.trim() || utr.trim().length < 6)
    return 'Enter the UTR / transaction reference';
  return null;
}

/* ─── Page ─── */
export default function Register() {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get('event') ?? '';

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [regId, setRegId] = useState(null);
  const [slideIn, setSlideIn] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);  // { text, ok }
  const [copied, setCopied] = useState(false);
  const [events, setEvents] = useState(staticEvents);
  const [holdToken, setHoldToken] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const holdInProgress = useRef(false);

  // Sync timeLeft when expiresAt or step changes
  useEffect(() => {
    if (!expiresAt) return;
    const update = () => {
      const left = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setTimeLeft(left);
      if (left === 0) {
        setStep(0);
        if (form.event_id) sessionStorage.removeItem(`hold_${form.event_id}`);
        setHoldToken(null);
        setExpiresAt(null);
        setToastMsg({ text: "Seat hold expired. Please select the event again.", ok: false });
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    registration_no: '',
    phone: '',
    college_or_company: '',
    team_name: '',
    team_members: [], // Will populate dynamically based on team_size
    event_id: preselectedId,
    utr_number: '',
    is_smit_student: false,
    accommodation: false,
    team_size: '',
    accommodation_days: 1,
    male_count: 0,
    female_count: 0,
    solo_gender: 'Male',
  });

  const [showRules, setShowRules] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Sync URL parameter if it changes
  useEffect(() => {
    if (preselectedId) {
      setForm(f => ({ ...f, event_id: preselectedId }));
    }
  }, [preselectedId]);



  const selected = events.find(e => String(e.id) === String(form.event_id));
  const isTeamEvent = selected?.type === 'team' || selected?.is_team || String(selected?.title || selected?.name).toLowerCase().includes('hackathon') || String(selected?.title || selected?.name).toLowerCase().includes('flag') || false;

  useEffect(() => {
    fetchEvents().then(data => {
      if (data && data.length > 0) {
        setEvents(data.map(d => ({ ...d, title: d.name || d.title })));
      }
    }).catch(err => console.error("Failed to fetch events", err));
  }, []);
  const amount = Number(selected?.price ?? 0);
  const totalPeople = isTeamEvent ? ((form.male_count || 0) + (form.female_count || 0)) : 1;
  const accommodationPrice = form.accommodation ? 500 * (form.accommodation_days || 1) * totalPeople : 0;
  const amountDue = form.is_smit_student ? 0 : amount + accommodationPrice;
  const steps = form.is_smit_student ? SMIT_STEPS : STEPS;
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

  async function submitRegistration(formState, tokenToUse = holdToken) {
    setSubmitting(true);
    setErrors({});
    try {
      const validMembers = isTeamEvent
        ? formState.team_members.filter(m => m.name.trim() || m.email.trim() || m.phone.trim())
        : [];
      const newId = await registerForEvent({
        fullName: formState.full_name,
        email: formState.email,
        phone: formState.phone,
        college: formState.college_or_company,
        teamName: isTeamEvent ? formState.team_name : null,
        teamMembers: validMembers,
        eventId: formState.event_id,
        utrId: formState.utr_number || "SMIT_FREE",
        collegeRegNo: formState.registration_no || null,
        holdToken: tokenToUse,
        accommodation: formState.accommodation,
        teamSize: isTeamEvent ? formState.team_size : null,
        accommodationDays: formState.accommodation ? formState.accommodation_days : null,
        maleCount: formState.accommodation ? (isTeamEvent ? formState.male_count : (formState.solo_gender === 'Male' ? 1 : 0)) : 0,
        femaleCount: formState.accommodation ? (isTeamEvent ? formState.female_count : (formState.solo_gender === 'Female' ? 1 : 0)) : 0,
      });
      setRegId(newId || genRegId());
      setStep(3);
      sessionStorage.removeItem(`hold_${formState.event_id}`);
      setToastMsg({ text: 'Registration confirmed ✓', ok: true });
    } catch (err) {
      if (err.message && err.message.includes("fully booked")) {
        setToastMsg({ text: "Sorry, this track just sold out. Please pick another.", ok: false });
        fetchEvents().then(data => {
          if (data && data.length > 0) setEvents(data.map(d => ({ ...d, title: d.name || d.title })));
        }).catch(e => console.error(e));
      } else if (err.message && err.message.includes("duplicate key")) {
        setToastMsg({ text: "This transaction ID has already been used.", ok: false });
      } else {
        console.error(err);
        setToastMsg({ text: "Something went wrong. Please try again.", ok: false });
      }
    } finally {
      setSubmitting(false);
    }
  }

  const handleBack = () => {
    if (holdToken) {
      releaseHold(holdToken).catch(() => {});
      setHoldToken(null);
      setExpiresAt(null);
      sessionStorage.removeItem(`hold_${form.event_id}`);
    }
    setStep(0);
  };

  /* Step 0 → continue */
  async function nextFromDetails() {
    const errs = validateDetails(form, isTeamEvent, selected);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const holdResult = await holdSeat(form.event_id);
      setHoldToken(holdResult.hold_token);
      setExpiresAt(holdResult.expires_at);
      sessionStorage.setItem(`hold_${form.event_id}`, JSON.stringify({
        hold_token: holdResult.hold_token,
        expires_at: holdResult.expires_at
      }));
      setErrors({});

      if (amountDue === 0 || form.is_smit_student) {
        await submitRegistration(form, holdResult.hold_token);
      } else {
        setStep(1);
      }
    } catch (err) {
      if (err.message && err.message.includes("fully booked")) {
        setToastMsg({ text: "Sorry, this event is fully booked.", ok: false });
      } else {
        console.error(err);
        setToastMsg({ text: "Couldn't reserve a seat. Please try again.", ok: false });
      }
    } finally {
      setSubmitting(false);
    }
  }

  /* Step 2 → submit UTR */
  async function submit() {
    const err = validateUtr(form.utr_number);
    if (err) { setErrors({ utr_number: err }); return; }
    setErrors({});
    await submitRegistration(form);
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
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

                <Field id="full_name" label="Full name" error={errors.full_name} required>
                  <input id="full_name" type="text" placeholder="Arjun Sharma"
                    value={form.full_name}
                    onChange={e => set('full_name', e.target.value)}
                    style={input(!!errors.full_name)} />
                </Field>

                <Field id="email" label="Email" error={errors.email} required>
                  <input id="email" type="email" placeholder="you@example.com"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    style={input(!!errors.email)} />
                </Field>

                {form.is_smit_student && (
                  <Field id="registration_no" label="Registration No." error={errors.registration_no} required>
                    <input id="registration_no" type="text" placeholder="e.g. 20230001"
                      value={form.registration_no}
                      onChange={e => set('registration_no', e.target.value)}
                      style={input(!!errors.registration_no)} />
                  </Field>
                )}

                <Field id="phone" label="Phone" error={errors.phone} required>
                  <input id="phone" type="tel" placeholder="+91 "
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    style={input(!!errors.phone)} />
                </Field>

                <Field id="org" label="College" error={errors.college_or_company} required>
                  <input id="org" type="text" placeholder="SMIT"
                    value={form.college_or_company}
                    onChange={e => set('college_or_company', e.target.value)}
                    style={input(!!errors.college_or_company)} />
                </Field>

                <Field id="event_id" label="Event" error={errors.event_id} required>
                  <div style={{ position: 'relative' }}>
                    <select id="event_id"
                      value={form.event_id}
                      onChange={e => set('event_id', e.target.value)}
                      style={{ ...input(!!errors.event_id), cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', paddingRight: '2.5rem' }}>
                      <option value="" style={{ background: '#09090f', color: '#fff' }}>Select an event…</option>
                      {events.map(ev => {
                        const isSoldOut = ev.seats_left <= 0;
                        return (
                          <option key={ev.id} value={ev.id} disabled={isSoldOut} style={{ background: '#09090f', color: isSoldOut ? '#ef4444' : '#fff' }}>
                            {ev.title || ev.name} {isSoldOut ? '— Sold Out' : `— ${form.is_smit_student ? 'Free for SMIT students' : formatPrice(Number(ev.price))}`}
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown size={18} color="#94a3b8" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </Field>

                {isTeamEvent && (
                  <>
                    <Field id="team_size" label={`Number of Team Members (${selected?.min_team_size || 1} - ${selected?.max_team_size || 5})`} error={errors.team_size} required>
                      <input id="team_size" type="number"
                        min={selected?.min_team_size || 1}
                        max={selected?.max_team_size || 5}
                        placeholder={`Min ${selected?.min_team_size || 1}, Max ${selected?.max_team_size || 5}`}
                        value={form.team_size}
                        onChange={e => {
                          const size = parseInt(e.target.value) || '';
                          set('team_size', size);
                          const newMembers = [...form.team_members];
                          const targetLen = typeof size === 'number' && size > 1 ? size - 1 : 0;
                          while (newMembers.length < targetLen) newMembers.push({ name: '', email: '', phone: '' });
                          if (newMembers.length > targetLen) newMembers.length = targetLen;
                          set('team_members', newMembers);
                        }}
                        style={input(!!errors.team_size)} />
                    </Field>

                    <Field id="team_name" label="Team Name" error={errors.team_name} required>
                      <input id="team_name" type="text" placeholder="e.g. The Innovators"
                        value={form.team_name}
                        onChange={e => set('team_name', e.target.value)}
                        style={input(!!errors.team_name)} />
                    </Field>

                    {form.team_members.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                        <p style={{ ...styles.fieldLabel, marginBottom: '0.25rem', color: errors.team_members ? '#ef4444' : undefined }}>Other Team Members</p>
                        <p style={styles.hint}>You are the Team Leader. Fill details for the other {form.team_members.length} members.</p>
                        {form.team_members.map((member, idx) => (
                          <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', width: '100%' }}>Member {idx + 2}</span>
                            <input
                              type="text"
                              placeholder="Name"
                              value={member.name}
                              onChange={e => {
                                const newMembers = [...form.team_members];
                                newMembers[idx].name = e.target.value;
                                set('team_members', newMembers);
                              }}
                              style={{ ...input(false), flex: '1 1 120px' }}
                            />
                            <input
                              type="email"
                              placeholder="Email"
                              value={member.email}
                              onChange={e => {
                                const newMembers = [...form.team_members];
                                newMembers[idx].email = e.target.value;
                                set('team_members', newMembers);
                              }}
                              style={{ ...input(false), flex: '1 1 120px' }}
                            />
                            <input
                              type="tel"
                              placeholder="Phone"
                              value={member.phone}
                              onChange={e => {
                                const newMembers = [...form.team_members];
                                newMembers[idx].phone = e.target.value;
                                set('team_members', newMembers);
                              }}
                              style={{ ...input(false), flex: '1 1 100px' }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* SMIT checkbox */}
                <label style={styles.smitLabel} htmlFor="is_smit">
                  <input id="is_smit" type="checkbox"
                    checked={form.is_smit_student}
                    onChange={e => {
                      const checked = e.target.checked;
                      setForm(f => ({
                        ...f,
                        is_smit_student: checked,
                        college_or_company: checked ? 'SMIT' : f.college_or_company
                      }));
                    }}
                    style={styles.checkbox}
                  />
                  <span>
                    <span style={{ ...styles.smitBold, marginBottom: 0 }}>I am a SMIT student</span>
                  </span>
                </label>

                {/* Accommodation checkbox */}
                {!form.is_smit_student && (
                  <div style={{ ...styles.smitLabel, flexDirection: 'column', alignItems: 'stretch', gap: '4px', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', margin: 0 }} htmlFor="accommodation">
                        <input id="accommodation" type="checkbox"
                          checked={form.accommodation}
                          onChange={e => set('accommodation', e.target.checked)}
                          style={styles.checkbox}
                        />
                        <span>
                          <span style={{ ...styles.smitBold, marginBottom: 0 }}>I need accommodation (includes charges)</span>
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowRules(true);
                        }}
                        style={{
                          background: 'rgba(0, 195, 227, 0.1)',
                          border: '1px solid rgba(0, 195, 227, 0.3)',
                          color: '#00c3e3',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '12px',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          letterSpacing: '0.05em'
                        }}
                      >
                        Rules
                      </button>
                    </div>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginLeft: '28px' }}>*prices may vary at any time</span>

                    {form.accommodation && (
                      <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginLeft: '28px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <label style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Number of Days</label>
                          <input type="number" min="1" value={form.accommodation_days} onChange={e => set('accommodation_days', parseInt(e.target.value) || '')} style={{ ...input(!!errors.accommodation_days), padding: '0.5rem', width: '100px' }} />
                          {errors.accommodation_days && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.accommodation_days}</span>}
                        </div>

                        {!isTeamEvent ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Gender</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                                <input type="radio" name="solo_gender" value="Male" checked={form.solo_gender === 'Male'} onChange={() => set('solo_gender', 'Male')} style={{ accentColor: '#8b5cf6' }} /> Male
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                                <input type="radio" name="solo_gender" value="Female" checked={form.solo_gender === 'Female'} onChange={() => set('solo_gender', 'Female')} style={{ accentColor: '#8b5cf6' }} /> Female
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                              <label style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Male Count</label>
                              <input type="number" min="0" value={form.male_count} onChange={e => set('male_count', parseInt(e.target.value) || 0)} style={{ ...input(false), padding: '0.5rem' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                              <label style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Female Count</label>
                              <input type="number" min="0" value={form.female_count} onChange={e => set('female_count', parseInt(e.target.value) || 0)} style={{ ...input(false), padding: '0.5rem' }} />
                            </div>
                          </div>
                        )}
                        {errors.accommodation_counts && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.accommodation_counts}</span>}
                      </div>
                    )}
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
                    ? 'Checking availability…'
                    : form.is_smit_student
                      ? 'Confirm free registration'
                      : 'Continue to payment'}
                </button>
              </motion.div>
            )}

            {/* ── Step 1: Pay via UPI ── */}
            {step === 1 && (
              <motion.div key="pay" {...fade} style={{ ...styles.stepBody, alignItems: 'center', textAlign: 'center' }}>
                <div style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  Seat reserved for {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
                <p style={styles.amountLabel}>Amount due</p>
                <p style={styles.amountValue}>{formatPrice(amountDue)}</p>
                <p style={styles.eventName}>{selected?.title} {form.accommodation ? '+ Accommodation' : ''}</p>
                <div style={styles.qrWrap}>
                  <QRCodeSVG
                    value={`upi://pay?pa=${UPI_ID}&pn=TECH%20ADRISHTA&am=${amountDue}&cu=INR`}
                    size={156}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
                <p style={styles.upiLine}>
                  UPI ID: <strong style={{ color: '#fff' }}>{UPI_ID}</strong>
                </p>
                <button type="button" onClick={copyUpi} style={styles.copyBtn} id="copy-upi-btn">
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy UPI ID'}
                </button>
                <div style={styles.btnRow}>
                  <button type="button" onClick={handleBack} style={styles.ghostBtn}>Back</button>
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

      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setShowRules(false)}
          >
            <motion.div
              initial={{ y: -1000 }}
              animate={{ y: 0 }}
              exit={{ y: -1000 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              style={{ width: '100%', maxWidth: '1100px' }}
              onClick={e => e.stopPropagation()}
            >
              <SwitchRulesCard onClose={() => setShowRules(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ─── Field wrapper ─── */
function Field({ id, label, error, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label htmlFor={id} style={styles.fieldLabel}>
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: '4px', fontSize: '0.875rem' }}>*</span>}
      </label>
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
    colorScheme: 'dark', // Native spin buttons will adapt to dark mode
  };
}

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.22 },
};

/* ─── Styles ─── */
const styles = {
  page: {
    paddingTop: '80px',
    minHeight: '100svh',
    position: 'relative',
  },

  toast: {
    position: 'fixed',
    bottom: '40px',
    right: '24px',
    padding: '12px 24px',
    borderRadius: '999px',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 600,
    zIndex: 9000,
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
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
