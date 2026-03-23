const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

// ─── Paths ────────────────────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, '..', 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const BLOCKED_FILE = path.join(DATA_DIR, 'blocked_slots.json');

// ─── Config ───────────────────────────────────────────────────────────────────
const MAX_BOOKINGS_PER_DAY = parseInt(process.env.MAX_BOOKINGS_PER_DAY) || 6;
const BUFFER_MINUTES = 15;
const BUSINESS_START = 9;   // 9am EST
const BUSINESS_END = 17;    // 5pm EST
const MAX_DAYS_AHEAD = 14;

// ─── In-memory lock to prevent double-booking ─────────────────────────────────
const bookingLock = new Set();

// ─── Helpers ──────────────────────────────────────────────────────────────────
function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeJSON(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/** Convert a local EST date+time string to UTC Date */
function toUTCDate(dateStr, timeStr) {
  // dateStr: "YYYY-MM-DD", timeStr: "HH:MM"
  // EST = UTC-5, EDT = UTC-4. Using EST fixed offset for simplicity.
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  // createUTC assuming EST (UTC-5)
  return new Date(Date.UTC(year, month - 1, day, hour + 5, minute));
}

/** Generate all slots for a given date+duration given existing bookings */
function generateAvailableSlots(dateStr, durationMin, bookings, blockedData) {
  const slots = [];
  const dayBookings = bookings.filter(b => b.date === dateStr);

  // Check daily limit
  if (dayBookings.length >= MAX_BOOKINGS_PER_DAY) return [];

  // Check blocked dates
  if (blockedData.blockedDates && blockedData.blockedDates.includes(dateStr)) return [];

  const [year, month, day] = dateStr.split('-').map(Number);
  const today = new Date();

  // Generate slot start times (30-min intervals from 9:00 to 16:30 max)
  for (let hour = BUSINESS_START; hour < BUSINESS_END; hour++) {
    for (let min = 0; min < 60; min += 30) {
      // Slot end must be within business hours
      const slotEndMinutes = hour * 60 + min + durationMin;
      if (slotEndMinutes > BUSINESS_END * 60) break;

      const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      const slotStart = toUTCDate(dateStr, timeStr);
      const slotEnd = new Date(slotStart.getTime() + durationMin * 60000);

      // Skip past slots
      if (slotStart <= today) continue;

      // Check against existing bookings with buffer
      const conflict = dayBookings.some(b => {
        const bStart = toUTCDate(b.date, b.time);
        const bEnd = new Date(bStart.getTime() + b.duration * 60000);
        const bufferMs = BUFFER_MINUTES * 60000;
        // Conflict if new slot overlaps existing booking + buffer zone
        return slotStart < new Date(bEnd.getTime() + bufferMs) &&
               slotEnd > new Date(bStart.getTime() - bufferMs);
      });

      // Check blocked slots from config
      const blockedConflict = (blockedData.blockedSlots || []).some(bs => {
        if (bs.date !== dateStr) return false;
        const bStart = toUTCDate(bs.date, bs.startTime);
        const bEnd = toUTCDate(bs.date, bs.endTime);
        return slotStart < bEnd && slotEnd > bStart;
      });

      if (!conflict && !blockedConflict) {
        slots.push(timeStr);
      }
    }
  }
  return slots;
}

/** Generate ICS file content */
function generateICS(booking) {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const start = toUTCDate(booking.date, booking.time);
  const end = new Date(start.getTime() + booking.duration * 60000);
  const dtStart = start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dtEnd = end.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const meetLink = booking.meetLink || 'https://meet.google.com/';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Web-Karigor//BookACall//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${booking.id}@web-karigor`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${booking.duration} Min Call with Web-Karigor`,
    `DESCRIPTION:Meeting Goal: ${booking.meetingGoal}\\nJoin: ${meetLink}\\n\\n${booking.description || ''}`,
    `ORGANIZER;CN=Web-Karigor:mailto:${process.env.SMTP_FROM || 'team@web-karigor.com'}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${booking.name}:mailto:${booking.email}`,
    `LOCATION:${meetLink}`,
    `URL:${meetLink}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Your call with Web-Karigor is tomorrow',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Your call with Web-Karigor is in 30 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/** Send email confirmation */
async function sendConfirmationEmail(booking, icsContent) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[Email] SMTP not configured — skipping email send');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const meetLink = booking.meetLink || '#';
  const humanDate = new Date(toUTCDate(booking.date, booking.time))
    .toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // ── User confirmation email
  await transporter.sendMail({
    from: `"Web-Karigor Team" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: booking.email,
    subject: `✅ Your ${booking.duration}-min call is confirmed — Web-Karigor`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#0f172a;color:#f1f5f9;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#4f46e5,#9333ea);padding:32px;text-align:center;">
          <h1 style="margin:0;font-size:24px;">📅 Call Confirmed!</h1>
          <p style="margin:8px 0 0;opacity:.85;">You're booked with Web-Karigor</p>
        </div>
        <div style="padding:32px;">
          <p>Hi <strong>${booking.name}</strong>,</p>
          <p>Your ${booking.duration}-minute <em>${booking.meetingGoal}</em> call has been confirmed.</p>
          <div style="background:#1e293b;border-radius:12px;padding:20px;margin:20px 0;">
            <p style="margin:0 0 8px;"><strong>📅 Date & Time:</strong> ${humanDate} EST</p>
            <p style="margin:0 0 8px;"><strong>⏱ Duration:</strong> ${booking.duration} minutes</p>
            <p style="margin:0 0 8px;"><strong>🎯 Goal:</strong> ${booking.meetingGoal}</p>
            ${booking.company ? `<p style="margin:0;"><strong>🏢 Company:</strong> ${booking.company}</p>` : ''}
          </div>
          <a href="${meetLink}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#9333ea);color:white;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:bold;">Join Google Meet →</a>
          <p style="margin-top:24px;color:#94a3b8;font-size:14px;">A calendar invite (.ics) is attached. You'll receive a reminder 24 hours before the call.</p>
          <hr style="border:none;border-top:1px solid #334155;margin:24px 0;">
          <p style="color:#64748b;font-size:12px;">© Web-Karigor · Reply to this email to reschedule</p>
        </div>
      </div>
    `,
    attachments: [{ filename: 'web-karigor-call.ics', content: icsContent, contentType: 'text/calendar' }],
  });

  // ── Team notification email
  if (process.env.TEAM_EMAIL) {
    await transporter.sendMail({
      from: `"Web-Karigor Bot" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.TEAM_EMAIL,
      subject: `🔔 New ${booking.duration}-min call booked — ${booking.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;">
          <h2>New call booked!</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;"><strong>Name:</strong></td><td>${booking.name}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Email:</strong></td><td>${booking.email}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Company:</strong></td><td>${booking.company || '—'}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Date/Time:</strong></td><td>${humanDate} EST</td></tr>
            <tr><td style="padding:6px 0;"><strong>Duration:</strong></td><td>${booking.duration} min</td></tr>
            <tr><td style="padding:6px 0;"><strong>Goal:</strong></td><td>${booking.meetingGoal}</td></tr>
            <tr><td style="padding:6px 0;"><strong>LinkedIn:</strong></td><td>${booking.linkedin || '—'}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Description:</strong></td><td>${booking.description || '—'}</td></tr>
          </table>
        </div>
      `,
    });
  }
}

/** Send Slack / Discord webhook notification */
async function sendWebhookNotification(booking) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('[Webhook] No webhook URL configured — skipping');
    return;
  }

  const isDiscord = (process.env.DISCORD_WEBHOOK_URL && !process.env.SLACK_WEBHOOK_URL);
  const text = `📅 *New ${booking.duration}-min call booked!*\n• *Name:* ${booking.name}\n• *Email:* ${booking.email}\n• *Company:* ${booking.company || '—'}\n• *Date:* ${booking.date} at ${booking.time} EST\n• *Goal:* ${booking.meetingGoal}`;

  const body = isDiscord
    ? JSON.stringify({ content: text })
    : JSON.stringify({ text });

  const https = require('https');
  const url = new URL(webhookUrl);
  const postData = body;
  await new Promise((resolve, reject) => {
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) },
    }, (res) => { res.resume(); resolve(); });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ─── Route Handlers ───────────────────────────────────────────────────────────

/**
 * GET /api/book-call/availability
 * Query: date (YYYY-MM-DD), duration (15|30)
 * Returns available time slots in EST
 */
exports.getAvailability = (req, res) => {
  const { date, duration } = req.query;
  const durationMin = parseInt(duration) || 30;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ success: false, message: 'Invalid date format' });
  }

  // Validate date range
  const selected = new Date(date + 'T00:00:00-05:00'); // EST
  const now = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + MAX_DAYS_AHEAD);

  if (selected < now) return res.json({ success: true, available: [] });
  if (selected > maxDate) return res.json({ success: true, available: [] });

  // Check if weekday
  const dow = selected.getDay();
  if (dow === 0 || dow === 6) return res.json({ success: true, available: [] });

  const bookings = readJSON(BOOKINGS_FILE);
  const blockedData = readJSON(BLOCKED_FILE);
  const blocked = typeof blockedData === 'object' && !Array.isArray(blockedData)
    ? blockedData
    : { blockedDates: [], blockedSlots: [] };

  const slots = generateAvailableSlots(date, durationMin, bookings, blocked);
  res.json({ success: true, available: slots });
};

/**
 * POST /api/book-call
 * Body: name, email, company, meetingGoal, description, linkedin, date, time, duration, timezone, website (honeypot)
 */
exports.handleBookingSubmission = async (req, res) => {
  const {
    name, email, company, meetingGoal, description, linkedin,
    date, time, duration, timezone,
    website, // honeypot
  } = req.body;

  // ── Honeypot
  if (website) {
    console.log('[Spam] Honeypot triggered');
    return res.status(200).json({ success: true, message: 'Booking request received' });
  }

  // ── Required field validation
  if (!name || !email || !date || !time || !meetingGoal) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }

  // ── Email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  const durationMin = parseInt(duration) === 15 ? 15 : 30;

  // ── Date range validation (server-side)
  const selectedDate = new Date(date + 'T00:00:00-05:00');
  const now = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + MAX_DAYS_AHEAD);

  if (selectedDate < now) {
    return res.status(400).json({ success: false, message: 'Cannot book a slot in the past.' });
  }
  if (selectedDate > maxDate) {
    return res.status(400).json({ success: false, message: `Bookings only available within the next ${MAX_DAYS_AHEAD} days.` });
  }

  // ── Weekend check
  const dow = selectedDate.getDay();
  if (dow === 0 || dow === 6) {
    return res.status(400).json({ success: false, message: 'Bookings are only available Monday–Friday.' });
  }

  // ── Business hours check
  const [hour, minute] = time.split(':').map(Number);
  const slotEndMin = hour * 60 + minute + durationMin;
  if (hour < BUSINESS_START || slotEndMin > BUSINESS_END * 60) {
    return res.status(400).json({ success: false, message: 'Slot is outside business hours (9am–5pm EST).' });
  }

  // ── Atomic lock key
  const lockKey = `${date}|${time}|${durationMin}`;
  if (bookingLock.has(lockKey)) {
    return res.status(409).json({ success: false, message: 'This slot is currently being reserved. Please try again in a moment.' });
  }
  bookingLock.add(lockKey);

  try {
    const bookings = readJSON(BOOKINGS_FILE);
    const blockedData = readJSON(BLOCKED_FILE);
    const blocked = typeof blockedData === 'object' && !Array.isArray(blockedData)
      ? blockedData
      : { blockedDates: [], blockedSlots: [] };

    // ── Re-check availability
    const available = generateAvailableSlots(date, durationMin, bookings, blocked);
    if (!available.includes(time)) {
      return res.status(409).json({ success: false, message: 'This slot is no longer available. Please choose another time.' });
    }

    // ── Generate Google Meet placeholder link (format matches real Meet links)
    const meetCode = uuidv4().replace(/-/g, '').substring(0, 10);
    const meetLink = `https://meet.google.com/${meetCode.substring(0,3)}-${meetCode.substring(3,7)}-${meetCode.substring(7,10)}`;

    // ── Create booking record
    const booking = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: (company || '').trim(),
      meetingGoal,
      description: (description || '').trim(),
      linkedin: (linkedin || '').trim(),
      date,
      time,
      duration: durationMin,
      timezone: timezone || 'America/New_York',
      meetLink,
      createdAt: new Date().toISOString(),
    };

    // ── Persist
    bookings.push(booking);
    writeJSON(BOOKINGS_FILE, bookings);

    // ── Generate ICS
    const icsContent = generateICS(booking);

    // ── Fire async side effects (non-blocking)
    Promise.all([
      sendConfirmationEmail(booking, icsContent).catch(e => console.error('[Email Error]', e.message)),
      sendWebhookNotification(booking).catch(e => console.error('[Webhook Error]', e.message)),
    ]);

    // ── Return success with ICS for immediate download
    res.status(201).json({
      success: true,
      message: 'Booking confirmed!',
      booking: {
        id: booking.id,
        name: booking.name,
        email: booking.email,
        date: booking.date,
        time: booking.time,
        duration: booking.duration,
        meetingGoal: booking.meetingGoal,
        meetLink: booking.meetLink,
      },
      icsContent: Buffer.from(icsContent).toString('base64'),
    });

  } finally {
    // Always release lock
    bookingLock.delete(lockKey);
  }
};
