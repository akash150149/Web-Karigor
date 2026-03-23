import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Clock, ChevronLeft, ChevronRight, Check, Download,
  Sparkles, Video, Globe, Briefcase, User, Mail, Building2,
  MessageSquare, Linkedin, X, AlertCircle
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:5000/api/book-call';
const MEETING_GOALS = ['Inquiry', 'Collaboration', 'Feedback', 'Partnership', 'Other'];
const DURATION_OPTIONS = [
  { value: 15, label: '15 min', tag: 'Quick Intro', description: 'A fast overview — get to know us and your goals.', icon: '⚡' },
  { value: 30, label: '30 min', tag: 'Discovery', description: 'Deep dive into your project, scope, and strategy.', icon: '🔭' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function detectTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function formatDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getCalendarDays(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDisplayDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

function formatDisplayTime(timeStr: string, tz: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) + ' EST';
}

function downloadICS(base64: string, name: string) {
  const decoded = atob(base64);
  const blob = new Blob([decoded], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `web-karigor-call-${name.toLowerCase().replace(/\s+/g, '-')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function fireGA4Event(params: Record<string, string | number>) {
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'booking_completed', params);
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const StepIndicator = ({ step, total }: { step: number; total: number }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
          i + 1 < step ? 'bg-indigo-600 text-white' :
          i + 1 === step ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 dark:ring-indigo-900/50' :
          'bg-muted text-muted-foreground'
        }`}>
          {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
        </div>
        {i < total - 1 && (
          <div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${i + 1 < step ? 'bg-indigo-600' : 'bg-border'}`} />
        )}
      </div>
    ))}
  </div>
);

const stepLabels = ['Duration', 'Date', 'Time', 'Details', 'Confirmed'];

// ─── Main Component ───────────────────────────────────────────────────────────
interface BookingData {
  duration: number;
  date: string;
  time: string;
  name: string;
  email: string;
  company: string;
  meetingGoal: string;
  description: string;
  linkedin: string;
  website: string; // honeypot
}

interface BookingResult {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  duration: number;
  meetingGoal: string;
  meetLink: string;
  icsContent: string;
}

const BookACall = () => {
  const [step, setStep] = useState(1);
  const [timezone, setTimezone] = useState(detectTimezone());
  const [showTzSelector, setShowTzSelector] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<BookingResult | null>(null);

  const [booking, setBooking] = useState<BookingData>({
    duration: 30,
    date: '',
    time: '',
    name: '',
    email: '',
    company: '',
    meetingGoal: '',
    description: '',
    linkedin: '',
    website: '', // honeypot — never shown to user
  });

  const calDays = getCalendarDays();
  const TIMEZONES = ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney'];

  // Fetch slots when date or duration changes
  useEffect(() => {
    if (!booking.date) return;
    setLoadingSlots(true);
    setAvailableSlots([]);
    setBooking(prev => ({ ...prev, time: '' }));

    fetch(`${API_BASE}/availability?date=${booking.date}&duration=${booking.duration}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setAvailableSlots(data.available);
        else setError('Could not load availability. Please try again.');
      })
      .catch(() => setError('Could not connect to server. Please try again.'))
      .finally(() => setLoadingSlots(false));
  }, [booking.date, booking.duration]);

  const update = (field: keyof BookingData, value: string | number) =>
    setBooking(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...booking, timezone }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ ...data.booking, icsContent: data.icsContent });
        setStep(5);
        fireGA4Event({
          booking_duration: booking.duration,
          meeting_goal: booking.meetingGoal,
          booking_date: booking.date,
        });
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Could not submit booking. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

  // ── Step 1: Duration Picker
  const Step1 = () => (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-extrabold text-foreground mb-2">Choose Call Duration</h3>
        <p className="text-muted-foreground">Select the type of consultation that fits your needs.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {DURATION_OPTIONS.map(opt => (
          <button
            key={opt.value}
            id={`duration-${opt.value}`}
            onClick={() => update('duration', opt.value)}
            className={`group p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-[1.02] ${
              booking.duration === opt.value
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20'
                : 'border-border bg-card hover:border-indigo-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{opt.icon}</span>
              {booking.duration === opt.value && (
                <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-extrabold text-foreground">{opt.label}</span>
              <span className="text-sm font-bold text-indigo-600 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">{opt.tag}</span>
            </div>
            <p className="text-sm text-muted-foreground">{opt.description}</p>
          </button>
        ))}
      </div>
      <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-indigo-600 shrink-0" />
        <p className="text-sm text-muted-foreground">Available <strong className="text-foreground">Mon–Fri, 9:00 AM – 5:00 PM EST</strong>. Buffer time is automatically applied between sessions.</p>
      </div>
      <button id="step1-next"
        onClick={() => setStep(2)}
        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/40 hover:scale-[1.01]"
      >
        Choose a Date →
      </button>
    </div>
  );

  // ── Step 2: Calendar
  const Step2 = () => {
    const weeks: Date[][] = [];
    const firstDay = calDays[0];
    const dayOfWeek = firstDay.getDay(); // 0=Sun
    const paddedDays: (Date | null)[] = Array(dayOfWeek).fill(null).concat(calDays);
    while (paddedDays.length % 7 !== 0) paddedDays.push(null);
    for (let i = 0; i < paddedDays.length; i += 7) weeks.push(paddedDays.slice(i, i + 7) as Date[]);

    return (
      <div>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-extrabold text-foreground mb-2">Pick a Date</h3>
          <p className="text-muted-foreground">Available dates for the next 14 days.</p>
        </div>

        {/* Timezone Row */}
        <div className="flex items-center justify-end gap-2 mb-4">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <button
            onClick={() => setShowTzSelector(!showTzSelector)}
            className="text-sm text-indigo-600 font-medium hover:underline"
          >
            {timezone}
          </button>
          {showTzSelector && (
            <div className="absolute top-auto right-4 z-50 mt-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden w-64">
              {TIMEZONES.map(tz => (
                <button key={tz} onClick={() => { setTimezone(tz); setShowTzSelector(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${tz === timezone ? 'text-indigo-600 font-bold' : 'text-foreground'}`}
                >
                  {tz}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
          <div className="grid grid-cols-7 bg-indigo-600">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="py-2 text-center text-xs font-bold text-white/80">{d}</div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 border-t border-border">
              {week.map((day, di) => {
                if (!day) return <div key={di} className="py-3 border-r border-border last:border-r-0 bg-muted/20" />;
                const dateStr = formatDateStr(day);
                const weekend = isWeekend(day);
                const isPast = day < new Date(new Date().setHours(0,0,0,0));
                const isSelected = booking.date === dateStr;
                const disabled = weekend || isPast;
                return (
                  <button
                    key={di}
                    id={`cal-day-${dateStr}`}
                    disabled={disabled}
                    onClick={() => { update('date', dateStr); setStep(3); }}
                    className={`relative py-3 border-r border-border last:border-r-0 flex flex-col items-center gap-0.5 transition-all ${
                      disabled ? 'opacity-30 cursor-not-allowed bg-muted/10' :
                      isSelected ? 'bg-indigo-600 text-white' :
                      'hover:bg-indigo-50 dark:hover:bg-indigo-950/30 cursor-pointer'
                    }`}
                  >
                    <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-foreground'}`}>
                      {day.getDate()}
                    </span>
                    {!disabled && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-400'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <button id="step2-back" onClick={() => setStep(1)}
          className="w-full py-3 border border-border text-foreground rounded-xl font-semibold hover:bg-muted transition-all"
        >
          ← Back
        </button>
      </div>
    );
  };

  // ── Step 3: Time Slot Picker
  const Step3 = () => (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-extrabold text-foreground mb-1">Pick a Time</h3>
        <p className="text-muted-foreground text-sm">{formatDisplayDate(booking.date)} · <span className="text-indigo-600 font-medium">{booking.duration} min</span></p>
      </div>

      {loadingSlots ? (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {Array(9).fill(0).map((_, i) => (
            <div key={i} className="h-12 bg-muted/60 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : availableSlots.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-2xl mb-6">
          <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-bold text-foreground mb-1">No slots available</p>
          <p className="text-sm text-muted-foreground">This day is fully booked or unavailable. Please choose another date.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {availableSlots.map(slot => (
            <button
              key={slot}
              id={`slot-${slot}`}
              onClick={() => { update('time', slot); setStep(4); }}
              className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all hover:scale-105 ${
                booking.time === slot
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg'
                  : 'border-border bg-card hover:border-indigo-400 text-foreground'
              }`}
            >
              {formatDisplayTime(slot, timezone)}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 mb-4">
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Times shown in EST (your timezone: {timezone})</span>
      </div>

      <button id="step3-back" onClick={() => setStep(2)}
        className="w-full py-3 border border-border text-foreground rounded-xl font-semibold hover:bg-muted transition-all"
      >
        ← Change Date
      </button>
    </div>
  );

  // ── Step 4: Lead Capture Form
  const Step4 = () => {
    const isValid = booking.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email) && booking.meetingGoal;
    return (
      <div>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-extrabold text-foreground mb-1">Your Details</h3>
          <p className="text-sm text-muted-foreground">
            {formatDisplayDate(booking.date)} · {formatDisplayTime(booking.time, timezone)} · {booking.duration} min
          </p>
        </div>

        <div className="space-y-4">
          {/* Honeypot — hidden from users */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={booking.website}
            onChange={e => update('website', e.target.value)}
            style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" /> Full Name <span className="text-red-500">*</span>
              </label>
              <input id="field-name" type="text" placeholder="Jane Smith"
                value={booking.name} onChange={e => update('name', e.target.value)}
                className="w-full px-4 py-3 bg-muted/50 border border-border text-foreground rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-muted-foreground/60"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" /> Company / Org
              </label>
              <input id="field-company" type="text" placeholder="Acme Inc."
                value={booking.company} onChange={e => update('company', e.target.value)}
                className="w-full px-4 py-3 bg-muted/50 border border-border text-foreground rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-600" /> Email Address <span className="text-red-500">*</span>
            </label>
            <input id="field-email" type="email" placeholder="jane@acme.com"
              value={booking.email} onChange={e => update('email', e.target.value)}
              className="w-full px-4 py-3 bg-muted/50 border border-border text-foreground rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-muted-foreground/60"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" /> Meeting Goal <span className="text-red-500">*</span>
            </label>
            <select id="field-goal"
              value={booking.meetingGoal} onChange={e => update('meetingGoal', e.target.value)}
              className="w-full px-4 py-3 bg-muted/50 border border-border text-foreground rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">Select a goal…</option>
              {MEETING_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" /> Brief Description
            </label>
            <textarea id="field-description" rows={3}
              placeholder="Tell us briefly what you'd like to discuss…"
              value={booking.description} onChange={e => update('description', e.target.value)}
              className="w-full px-4 py-3 bg-muted/50 border border-border text-foreground rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-muted-foreground/60"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5 flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-indigo-600" /> LinkedIn Profile <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <input id="field-linkedin" type="url" placeholder="https://linkedin.com/in/yourname"
              value={booking.linkedin} onChange={e => update('linkedin', e.target.value)}
              className="w-full px-4 py-3 bg-muted/50 border border-border text-foreground rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button id="step4-back" onClick={() => setStep(3)}
            className="flex-1 py-4 border border-border text-foreground rounded-xl font-semibold hover:bg-muted transition-all"
          >
            ← Back
          </button>
          <button id="step4-submit"
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className="flex-[2] py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Confirming…</>
            ) : (
              <><Video className="w-4 h-4" /> Confirm Booking</>
            )}
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-3">
          🔒 Your information is private and never shared.
        </p>
      </div>
    );
  };

  // ── Step 5: Success
  const Step5 = () => {
    if (!result) return null;
    const googleCalUrl = (() => {
      const [h, m] = result.time.split(':').map(Number);
      const start = new Date(result.date + 'T' + result.time + ':00-05:00');
      const end = new Date(start.getTime() + result.duration * 60000);
      const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${result.duration}min Call with Web-Karigor`)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(`Meeting Goal: ${result.meetingGoal}\nJoin: ${result.meetLink}`)}&location=${encodeURIComponent(result.meetLink)}`;
    })();

    return (
      <div className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
          className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/50"
        >
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </motion.div>

        <h3 className="text-3xl font-extrabold text-foreground mb-2">You're Booked! 🎉</h3>
        <p className="text-muted-foreground mb-8">A confirmation has been sent to <strong className="text-foreground">{result.email}</strong></p>

        <div className="bg-muted/50 rounded-2xl p-6 text-left mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Date & Time</p>
              <p className="font-bold text-foreground">{formatDisplayDate(result.date)} · {formatDisplayTime(result.time, timezone)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-bold text-foreground">{result.duration} minutes · {result.meetingGoal}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Video className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Video Link</p>
              <a href={result.meetLink} target="_blank" rel="noopener noreferrer"
                className="font-bold text-indigo-600 hover:underline break-all"
              >{result.meetLink}</a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button id="download-ics"
            onClick={() => downloadICS(result.icsContent, result.name)}
            className="py-3 border-2 border-indigo-600 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download .ICS
          </button>
          <a id="add-to-gcal" href={googleCalUrl} target="_blank" rel="noopener noreferrer"
            className="py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Add to Google Calendar
          </a>
        </div>

        <button id="book-another" onClick={() => {
          setStep(1);
          setBooking({ duration: 30, date: '', time: '', name: '', email: '', company: '', meetingGoal: '', description: '', linkedin: '', website: '' });
          setResult(null);
          setError('');
        }} className="text-sm text-muted-foreground hover:text-indigo-600 transition-colors underline">
          Book another call
        </button>
      </div>
    );
  };

  const stepComponents: Record<number, React.JSX.Element> = {
    1: <Step1 />,
    2: <Step2 />,
    3: <Step3 />,
    4: <Step4 />,
    5: <Step5 />,
  };

  // ─── Layout ───────────────────────────────────────────────────────────────
  return (
    <section id="book-call" className="py-24 bg-muted/30 transition-colors duration-300 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">READY TO SCALE?</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-extrabold text-foreground mb-4"
          >
            Book a Consultation
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            Choose a time that works for you. Real-time availability, instant confirmation, no back-and-forth.
          </motion.p>
        </div>

        {/* Wizard Card */}
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-card rounded-[2rem] border border-border shadow-2xl overflow-hidden"
          >
            <div className="p-8 lg:p-10">
              {step < 5 && <StepIndicator step={step} total={4} />}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {stepComponents[step]}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Trust signals */}
          {step < 5 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">✅ Free, no commitment</span>
              <span className="flex items-center gap-1.5">📅 Instant confirmation</span>
              <span className="flex items-center gap-1.5">🎥 Google Meet included</span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookACall;
