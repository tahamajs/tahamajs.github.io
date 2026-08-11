// src/components/modals/BookingModal.jsx
import { useState } from 'react';
import Modal from '../ui/Modal.jsx';

const TIMESLOTS = [
  '09:00 AM IRST (UTC+3:30)',
  '11:30 AM IRST (UTC+3:30)',
  '02:00 PM IRST (UTC+3:30)',
  '04:30 PM IRST (UTC+3:30)',
  '07:00 PM IRST (UTC+3:30)',
  '09:30 PM IRST (UTC+3:30)'
];

const TYPES = [
  '🚀 AI Advisory & Consulting',
  '🎓 Ph.D. / Academic Research Collaboration',
  '💼 Executive Recruitment & Engineering Role',
  '💡 1-on-1 Technical Mentorship & Guidance'
];

export default function BookingModal({ open, onClose, showToast, beep }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(TIMESLOTS[0]);
  const [meetingType, setMeetingType] = useState(TYPES[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!open) return null;

  const handleBook = (e) => {
    e.preventDefault();
    if (!name || !email || !selectedDate) return;
    
    beep?.(880, 'sine');
    setConfirmed(true);
    showToast?.(`📅 Meeting Booked for ${selectedDate} at ${selectedTime}! Invitation sent to ${email}`);

    // Formatted mailto fallback
    const subject = encodeURIComponent(`1-on-1 Meeting Booking: ${name} (${meetingType})`);
    const body = encodeURIComponent(`Hi Taha,\n\nI have scheduled a meeting via your portfolio:\n\n📅 Date: ${selectedDate}\n⏰ Time: ${selectedTime}\n🎯 Type: ${meetingType}\n👤 Name: ${name}\n✉️ Email: ${email}\n\nNotes:\n${notes}\n\nBest regards,\n${name}`);
    window.open(`mailto:tahamajlesi@ut.ac.ir?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="section-tag">📅 1-on-1 Calendar Booking</div>
      <h2 style={{ color: '#fff', marginBottom: '.5rem' }}>Schedule a Meeting with Taha 🤝</h2>
      <p style={{ fontSize: '.88rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
        Select a date and time slot below for a direct 1-on-1 Google Meet / Zoom call with Taha Majlesi.
      </p>

      {!confirmed ? (
        <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Select Topic / Purpose:</label>
            <select value={meetingType} onChange={e => setMeetingType(e.target.value)} className="form-input">
              {TYPES.map((t, i) => <option key={i} value={t}>{t}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Time Slot (Tehran Time):</label>
              <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} className="form-input">
                {TIMESLOTS.map((t, i) => <option key={i} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Your Full Name:</label>
              <input
                type="text"
                required
                placeholder="Dr. Sarah Connor"
                value={name}
                onChange={e => setName(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Your Email Address:</label>
              <input
                type="email"
                required
                placeholder="sarah@mit.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Discussion Topics / Agenda Notes:</label>
            <textarea
              rows="3"
              placeholder="Briefly describe what you'd like to discuss during our call..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '.5rem' }}>
            <i className="fas fa-calendar-check" /> Confirm &amp; Schedule Meeting
          </button>
        </form>
      ) : (
        <div className="telegram-success-box">
          <i className="fas fa-calendar-alt" style={{ fontSize: '2.5rem', color: 'var(--emerald)', marginBottom: '.5rem' }} />
          <h3>Meeting Confirmed!</h3>
          <p style={{ fontSize: '.85rem', color: 'var(--muted)', marginTop: '.4rem', lineHeight: '1.6' }}>
            A calendar invitation for <b>{selectedDate}</b> at <b>{selectedTime}</b> has been generated for <b>{name}</b> ({email}). Taha looks forward to talking with you!
          </p>

          <button className="btn-secondary" onClick={() => setConfirmed(false)} style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
            Schedule Another Slot
          </button>
        </div>
      )}
    </Modal>
  );
}
