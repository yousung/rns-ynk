import { useState, useEffect, useRef } from 'react';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function toStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
function fmt(s) {
  if (!s) return '';
  const [y, m, d] = s.split('-');
  return `${y}.${m}.${d}`;
}

const NAV_BTN = {
  background: 'none', border: '1px solid var(--border)', borderRadius: '0.25rem',
  cursor: 'pointer', color: 'var(--text-primary)', fontSize: '1.1rem',
  padding: '0.1rem 0.5rem', lineHeight: 1.4,
};

export default function DateRangePicker({ startDate, endDate, onChange }) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('start'); // 'start' | 'end'
  const [hover, setHover] = useState(null);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setHover(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function openPicker() {
    setStep(startDate && !endDate ? 'end' : 'start');
    setHover(null);
    setOpen(true);
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  function handleDay(dateStr) {
    if (step === 'start') {
      onChange({ start: dateStr, end: '' });
      setStep('end');
    } else {
      if (dateStr < startDate) {
        onChange({ start: dateStr, end: startDate });
      } else {
        onChange({ start: startDate, end: dateStr });
      }
      setHover(null);
      setOpen(false);
      setStep('start');
    }
  }

  function clear() {
    onChange({ start: '', end: '' });
    setStep('start');
    setHover(null);
    setOpen(false);
  }

  // Effective range for highlight
  const effEnd = step === 'end' && hover ? hover : endDate;
  const lo = startDate && effEnd ? (startDate <= effEnd ? startDate : effEnd) : startDate;
  const hi = startDate && effEnd ? (startDate <= effEnd ? effEnd : startDate) : effEnd;

  function dayStyle(dateStr) {
    const isLo = dateStr === lo;
    const isHi = dateStr === hi && lo !== hi;
    const inRange = lo && hi && dateStr > lo && dateStr < hi;
    const todayStr = toStr(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday = dateStr === todayStr;

    return {
      textAlign: 'center',
      padding: '0.3rem 0',
      fontSize: '0.82rem',
      borderRadius: isLo || isHi ? '50%' : '0',
      background: isLo || isHi
        ? 'var(--primary, #2563eb)'
        : inRange
        ? 'rgba(37,99,235,0.13)'
        : 'transparent',
      color: isLo || isHi
        ? '#fff'
        : inRange
        ? 'var(--primary, #2563eb)'
        : isToday
        ? 'var(--primary, #2563eb)'
        : 'var(--text-primary)',
      fontWeight: isToday && !isLo && !isHi ? 700 : 400,
      cursor: 'pointer',
      userSelect: 'none',
    };
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const label =
    startDate && endDate
      ? `${fmt(startDate)} ~ ${fmt(endDate)}`
      : startDate
      ? `${fmt(startDate)} ~ 종료일 선택`
      : '기간 선택';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={openPicker}
        style={{
          padding: '0.375rem 0.625rem',
          border: '1px solid var(--border)',
          borderRadius: '0.25rem',
          background: 'var(--bg-surface)',
          color: startDate ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontSize: '0.82rem',
          cursor: 'pointer',
          minWidth: 220,
          textAlign: 'left',
        }}
      >
        🗓 {label}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 9999,
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: '0.5rem', boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
          padding: '1rem', minWidth: 290,
        }}>
          {/* Month navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <button onClick={prevMonth} style={NAV_BTN}>‹</button>
            <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              {year}년 {month + 1}월
            </span>
            <button onClick={nextMonth} style={NAV_BTN}>›</button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.25rem' }}>
            {DAYS.map((d, i) => (
              <div key={d} style={{
                textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0',
                color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : 'var(--text-secondary)',
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px' }}>
            {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = toStr(year, month, day);
              return (
                <div
                  key={day}
                  style={dayStyle(dateStr)}
                  onClick={() => handleDay(dateStr)}
                  onMouseEnter={() => step === 'end' && setHover(dateStr)}
                  onMouseLeave={() => step === 'end' && setHover(null)}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '0.75rem', paddingTop: '0.5rem',
            borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {step === 'start' ? '시작일을 선택하세요' : '종료일을 선택하세요'}
            </span>
            <button onClick={clear} style={{
              fontSize: '0.75rem', color: 'var(--text-secondary)',
              background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem 0.4rem',
            }}>
              초기화
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
