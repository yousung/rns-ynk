import React from 'react';
import { useNavigate } from 'react-router-dom';

const lightVars = {
  bgBase: '#F0F4F8',
  bgPanel: '#FFFFFF',
  border: '#CBD5E1',
  cyan: '#0284C7',
  cyanDim: 'rgba(2,132,199,0.12)',
  amber: '#D97706',
  amberDim: 'rgba(217,119,6,0.12)',
  green: '#059669',
  greenDim: 'rgba(5,150,105,0.12)',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
};

const darkVars = {
  bgBase: '#070C14',
  bgPanel: '#0D1626',
  border: '#1E3A5F',
  cyan: '#00D4FF',
  cyanDim: 'rgba(0,212,255,0.12)',
  amber: '#F59E0B',
  amberDim: 'rgba(245,158,11,0.12)',
  green: '#10B981',
  greenDim: 'rgba(16,185,129,0.12)',
  textPrimary: '#E8F0FE',
  textSecondary: '#7B91AD',
};

function Card({ v, label, desc, accentColor, accentDim, glowColor, icon, onClick, hovered, onMouseEnter, onMouseLeave }) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: v.bgPanel,
        border: `1px solid ${hovered ? accentColor : v.border}`,
        borderRadius: 16,
        padding: '36px 32px',
        width: 260,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 0 32px ${glowColor}` : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 16,
          background: `radial-gradient(ellipse at 50% 0%, ${accentDim.replace('0.12', '0.08')}, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s',
          pointerEvents: 'none',
        }}
      />
      <div style={{
        width: 64,
        height: 64,
        borderRadius: 16,
        background: accentDim,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          style={{ width: 32, height: 32, stroke: accentColor }}>
          {icon}
        </svg>
      </div>
      <div style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.01em', color: accentColor }}>
        {label}
      </div>
      <div style={{ fontSize: '0.8rem', color: v.textSecondary, textAlign: 'center', lineHeight: 1.6 }}>
        {desc}
      </div>
      <div style={{ fontSize: '1.1rem', opacity: hovered ? 1 : 0, transition: 'opacity 0.2s', color: accentColor }}>
        →
      </div>
    </div>
  );
}

export default function PlatformSelect() {
  const navigate = useNavigate();
  const [hovered, setHovered] = React.useState(null);
  const [theme, setTheme] = React.useState('light');
  const v = theme === 'light' ? lightVars : darkVars;

  const bgImage = theme === 'dark'
    ? [
        'radial-gradient(ellipse at 20% 50%, rgba(0,212,255,0.07) 0%, transparent 55%)',
        'radial-gradient(ellipse at 80% 50%, rgba(0,100,200,0.07) 0%, transparent 55%)',
        'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)',
      ].join(', ')
    : 'none';

  const cards = [
    {
      key: 'web',
      label: '관리용 웹',
      desc: '재고·입출고·사용자 관리를\n데스크탑 브라우저에서',
      accentColor: v.cyan,
      accentDim: v.cyanDim,
      glowColor: theme === 'dark' ? 'rgba(0,212,255,0.2)' : 'rgba(2,132,199,0.15)',
      icon: (
        <>
          <rect x="3" y="3" width="18" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </>
      ),
      onClick: () => navigate('/login'),
    },
    {
      key: 'tablet',
      label: '태블릿 웹',
      desc: '창고 현장에서 태블릿으로\n입출고 바코드 스캔 처리',
      accentColor: v.amber,
      accentDim: v.amberDim,
      glowColor: theme === 'dark' ? 'rgba(245,158,11,0.2)' : 'rgba(217,119,6,0.15)',
      icon: (
        <>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </>
      ),
      onClick: () => { window.location.href = './demo/tablet/login.html'; },
    },
    {
      key: 'kiosk',
      label: '키오스크',
      desc: '터치스크린 키오스크 전용\n간편 입출고 처리',
      accentColor: v.green,
      accentDim: v.greenDim,
      glowColor: theme === 'dark' ? 'rgba(16,185,129,0.2)' : 'rgba(5,150,105,0.15)',
      icon: (
        <>
          <rect x="2" y="2" width="20" height="20" rx="3" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="12" y1="8" x2="12" y2="16" />
        </>
      ),
      onClick: () => { window.location.href = './demo/kiosk/index.html'; },
    },
  ];

  return (
    <div style={{
      fontFamily: "'Noto Sans KR', sans-serif",
      backgroundColor: v.bgBase,
      backgroundImage: bgImage,
      backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: v.textPrimary,
      padding: '32px 16px',
      position: 'relative',
      transition: 'background-color 0.25s',
    }}>
      {/* 테마 토글 */}
      <button
        onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 42,
          height: 42,
          borderRadius: 10,
          border: `1px solid ${v.border}`,
          background: v.bgPanel,
          color: v.textSecondary,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.15rem',
          transition: 'all 0.2s',
          flexShrink: 0,
        }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div style={{
        fontSize: '1.75rem',
        fontWeight: 700,
        color: v.cyan,
        letterSpacing: '-0.02em',
        marginBottom: 8,
        textAlign: 'center',
      }}>
        창고 관리 시스템
      </div>
      <div style={{ fontSize: '0.85rem', color: v.textSecondary, marginBottom: 48, textAlign: 'center' }}>
        플랫폼을 선택하세요
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 900 }}>
        {cards.map((c) => (
          <Card
            key={c.key}
            v={v}
            {...c}
            hovered={hovered === c.key}
            onMouseEnter={() => setHovered(c.key)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </div>
    </div>
  );
}
