import React from 'react';
import { useNavigate } from 'react-router-dom';

const lightVars = {
  bgBase: '#F0F4F8',
  bgPanel: '#FFFFFF',
  bgSubtle: '#F8FAFC',
  border: '#CBD5E1',
  borderSubtle: '#E2E8F0',
  cyan: '#0284C7',
  cyanDim: 'rgba(2,132,199,0.12)',
  amber: '#D97706',
  amberDim: 'rgba(217,119,6,0.12)',
  green: '#059669',
  greenDim: 'rgba(5,150,105,0.12)',
  red: '#DC2626',
  redDim: 'rgba(220,38,38,0.12)',
  purple: '#7C3AED',
  purpleDim: 'rgba(124,58,237,0.12)',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
};

const darkVars = {
  bgBase: '#070C14',
  bgPanel: '#0D1626',
  bgSubtle: '#0A1220',
  border: '#1E3A5F',
  borderSubtle: '#15243B',
  cyan: '#00D4FF',
  cyanDim: 'rgba(0,212,255,0.12)',
  amber: '#F59E0B',
  amberDim: 'rgba(245,158,11,0.12)',
  green: '#10B981',
  greenDim: 'rgba(16,185,129,0.12)',
  red: '#EF4444',
  redDim: 'rgba(239,68,68,0.12)',
  purple: '#A78BFA',
  purpleDim: 'rgba(167,139,250,0.12)',
  textPrimary: '#E8F0FE',
  textSecondary: '#7B91AD',
};

function IconBox({ v, color, colorDim, children, size = 72 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: 18,
      background: colorDim,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        style={{ width: size * 0.5, height: size * 0.5, stroke: color }}>
        {children}
      </svg>
    </div>
  );
}

function StepList({ v, items, accentColor }) {
  return (
    <ol style={{
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      {items.map((item, idx) => (
        <li key={idx} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
          padding: '14px 18px',
          background: v.bgSubtle,
          border: `1px solid ${v.borderSubtle}`,
          borderRadius: 12,
          transition: 'border-color 0.15s',
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: accentColor,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {idx + 1}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: v.textPrimary, marginBottom: 4, wordBreak: 'keep-all' }}>
              {item.title}
            </div>
            <div style={{ fontSize: '0.82rem', color: v.textSecondary, lineHeight: 1.6, wordBreak: 'keep-all' }}>
              {item.desc}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function FeatureCard({ v, label, desc, color, colorDim, icon }) {
  return (
    <div style={{
      background: v.bgSubtle,
      border: `1px solid ${v.borderSubtle}`,
      borderRadius: 12,
      padding: '20px 22px',
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start',
      flex: '1 1 240px',
      minWidth: 0,
    }}>
      <IconBox v={v} color={color} colorDim={colorDim} size={44}>
        {icon}
      </IconBox>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color, marginBottom: 6, wordBreak: 'keep-all' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.8rem', color: v.textSecondary, lineHeight: 1.6, wordBreak: 'keep-all' }}>
          {desc}
        </div>
      </div>
    </div>
  );
}

function SlideHeader({ v, badge, badgeColor, title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {badge && (
        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: 999,
          background: badgeColor ? `${badgeColor}1F` : v.cyanDim,
          color: badgeColor || v.cyan,
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          marginBottom: 12,
        }}>
          {badge}
        </div>
      )}
      <h2 style={{
        margin: 0,
        fontSize: '1.8rem',
        fontWeight: 700,
        color: v.textPrimary,
        letterSpacing: '-0.02em',
        wordBreak: 'keep-all',
        lineHeight: 1.3,
      }}>
        {title}
      </h2>
      {subtitle && (
        <div style={{
          marginTop: 8,
          fontSize: '0.95rem',
          color: v.textSecondary,
          lineHeight: 1.6,
          wordBreak: 'keep-all',
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function SlideCover({ v }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      minHeight: 420,
      padding: '40px 20px',
    }}>
      <IconBox v={v} color={v.cyan} colorDim={v.cyanDim} size={96}>
        <rect x="3" y="3" width="18" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </IconBox>
      <div style={{
        marginTop: 28,
        fontSize: '0.78rem',
        fontWeight: 700,
        letterSpacing: '0.3em',
        color: v.cyan,
      }}>
        YNK WMS
      </div>
      <h1 style={{
        margin: '12px 0 0',
        fontSize: '2.6rem',
        fontWeight: 800,
        color: v.textPrimary,
        letterSpacing: '-0.03em',
        wordBreak: 'keep-all',
      }}>
        창고 관리 시스템 사용 가이드
      </h1>
      <div style={{
        marginTop: 18,
        fontSize: '1rem',
        color: v.textSecondary,
        lineHeight: 1.7,
        maxWidth: 560,
        wordBreak: 'keep-all',
      }}>
        관리 웹·현장 태블릿·키오스크 모니터링을 단일 시스템에서 제공합니다.
      </div>
      <div style={{
        marginTop: 32,
        display: 'inline-flex',
        gap: 8,
        padding: '8px 14px',
        borderRadius: 999,
        border: `1px solid ${v.border}`,
        color: v.textSecondary,
        fontSize: '0.78rem',
      }}>
        <span>v1.0.0 · 2026-04-20</span>
      </div>
    </div>
  );
}

function SlidePlatforms({ v }) {
  const platforms = [
    {
      label: '관리자 웹',
      desc: '관리자·사무직용 풀기능 시스템. 대시보드·입고예정·출고예정·입고처리·출고처리·재고·상품·활동로그·사용자관리을 통합 관리합니다.',
      color: v.cyan,
      colorDim: v.cyanDim,
      icon: (<><rect x="3" y="3" width="18" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>),
    },
    {
      label: '현장 태블릿',
      desc: '창고 작업자용 터치 최적화 인터페이스. 웹에서 등록한 입고예정·출고예정만 처리 가능. 대형 버튼과 단계별 선택으로 현장 실수를 최소화합니다.',
      color: v.amber,
      colorDim: v.amberDim,
      icon: (<><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>),
    },
    {
      label: '키오스크 모니터',
      desc: '관리자 웹 + 입고·출고 화면에 전동랙 리모컨 제어 기능이 추가됩니다.',
      color: v.green,
      colorDim: v.greenDim,
      icon: (<><rect x="2" y="2" width="20" height="20" rx="3" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="12" y1="8" x2="12" y2="16" /></>),
    },
  ];
  return (
    <div>
      <SlideHeader v={v} badge="시스템 구성" title="3개 플랫폼, 하나의 창고 시스템" subtitle="사용자 역할과 사용 환경에 맞춰 최적화된 세 가지 인터페이스를 제공합니다." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {platforms.map((p) => (
          <FeatureCard key={p.label} v={v} {...p} />
        ))}
      </div>
    </div>
  );
}

function SlideLoginDashboard({ v }) {
  return (
    <div>
      <SlideHeader v={v} badge="관리자 웹 · 1/5" badgeColor={v.cyan} title="로그인 및 대시보드" subtitle="관리자는 로그인 후 창고 상황을 한눈에 파악할 수 있습니다." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
        <FeatureCard v={v} label="사용자 인증"
          desc="이메일·비밀번호로 로그인. 관리자·매니저·창고담당·뷰어 역할별로 기능 제한."
          color={v.cyan} colorDim={v.cyanDim}
          icon={(<><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></>)}
        />
        <FeatureCard v={v} label="대시보드 요약"
          desc="현재 총 재고·입고예정·출고예정·등록상품·창고가동률을 한 화면에 표시."
          color={v.amber} colorDim={v.amberDim}
          icon={(<><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></>)}
        />
      </div>
      <StepList v={v} accentColor={v.cyan} items={[
        { title: '관리자 웹 선택 후 로그인', desc: '이메일과 비밀번호로 인증' },
        { title: '대시보드 진입', desc: '5개 KPI와 예정/로그 요약 테이블 확인' },
        { title: '좌측 메뉴로 원하는 작업 선택', desc: '입고예정·출고예정·입고처리·출고처리·재고·상품·로그·사용자 관리' },
      ]} />
    </div>
  );
}

function SlideInbound({ v }) {
  return (
    <div>
      <SlideHeader v={v} badge="관리자 웹 · 2/5" badgeColor={v.cyan} title="입고 처리 — 예정 등록 후 위치 지정" subtitle="먼저 입고예정을 등록한 후, 입고처리 화면에서 창고 위치를 지정하고 실행합니다." />
      <StepList v={v} accentColor={v.amber} items={[
        { title: '입고예정 등록', desc: '입고예정 메뉴에서 상품·수량·예정일을 등록. 현장과 태블릿은 이 예정 데이터만 처리 가능합니다.' },
        { title: '입고처리 화면 진입', desc: '입고예정에서 처리 버튼 클릭 후 입고처리 화면으로 이동. 왼쪽 패널에서 대기 상태인 예정을 확인하고 선택합니다.' },
        { title: '창고·랙·열·단 선택', desc: '창고 선택 후 매트릭스에서 열을 클릭. 자동으로 빈 단이 매칭됩니다. 이미 같은 상품이 있는 단은 강조 표시.' },
        { title: '수량 확인 후 입고 실행', desc: '선택된 위치와 기본 수량이 화면에 표시. 필요 시 수량 수정 후 "입고 실행" 버튼으로 확정.' },
        { title: '적재 결과 확인', desc: '입고 후 창고 현황·적재 상세·통계로 적재 상태를 즉시 검증합니다.' },
      ]} />
    </div>
  );
}

function SlideOutbound({ v }) {
  return (
    <div>
      <SlideHeader v={v} badge="관리자 웹 · 3/5" badgeColor={v.cyan} title="출고 처리 — 예정 등록 후 FIFO 자동 선택" subtitle="먼저 출고예정을 등록한 후, 입고일 순서대로 자동으로 가장 오래된 상품부터 출고합니다." />
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ padding: '6px 12px', borderRadius: 999, background: v.amberDim, color: v.amber, fontSize: '0.78rem', fontWeight: 700 }}>F1 · 1순위 (앰버)</div>
        <div style={{ padding: '6px 12px', borderRadius: 999, background: v.cyanDim, color: v.cyan, fontSize: '0.78rem', fontWeight: 700 }}>F2 · 2순위 (파랑)</div>
        <div style={{ padding: '6px 12px', borderRadius: 999, background: v.borderSubtle, color: v.textSecondary, fontSize: '0.78rem', fontWeight: 700 }}>Fn · 그 외</div>
      </div>
      <StepList v={v} accentColor={v.red} items={[
        { title: '출고예정 등록', desc: '출고예정 메뉴에서 상품·수량·납품처를 등록. 웹과 태블릿에서만 출고 처리 가능합니다.' },
        { title: '출고처리 화면 진입', desc: '출고예정 카드에서 처리 버튼 클릭. 선택한 상품이 있는 창고로 자동 이동합니다.' },
        { title: 'FIFO 순서 자동 계산', desc: '해당 상품의 재고를 입고일 순서대로 정렬. 가장 오래된 로트(F1)부터 최우선 표시. 매트릭스에 색상(앰버·파랑·회색)으로 순위 표시.' },
        { title: '출고 위치 자동 선택', desc: 'F1 위치(랙·열·단)가 자동으로 화면에 표시됩니다. 수량 확인 후 "출고 실행" 버튼으로 확정.' },
        { title: '출고 결과 확인', desc: '창고 현황·적재 상세·FIFO 재고 테이블에서 순위·입고일·위치를 교차 검증합니다.' },
      ]} />
    </div>
  );
}

function SlideInventory({ v }) {
  return (
    <div>
      <SlideHeader v={v} badge="관리자 웹 · 4/5" badgeColor={v.cyan} title="재고와 상품 조회" subtitle="현재 창고에 적재된 재고 상황과 등록된 상품 목록을 확인할 수 있습니다." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
        <FeatureCard v={v} label="재고 리스트"
          desc="현재 창고에 있는 모든 재고를 확인. 상품별 총수량·보관 위치 개수 표시. 상세 조회로 입고일·팔레트 위치 확인."
          color={v.cyan} colorDim={v.cyanDim}
          icon={(<><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>)}
        />
        <FeatureCard v={v} label="상품 목록"
          desc="현재 등록된 전체 상품 종류 및 개수 확인. 완제품·부자재별로 분류 관리."
          color={v.green} colorDim={v.greenDim}
          icon={(<><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /></>)}
        />
      </div>
      <StepList v={v} accentColor={v.cyan} items={[
        { title: '재고 메뉴 선택', desc: '현재 창고에 적재된 모든 재고의 위치와 수량을 확인합니다.' },
        { title: '상품별 재고 현황', desc: '각 상품의 총 재고·여러 위치에 분산된 팔레트 수·입고일을 한눈에 파악.' },
        { title: '상품 메뉴 선택', desc: '등록된 전체 상품 종류와 개수를 확인. 현재 완제품 10개, 부자재 5개 총 15개 상품 관리 중.' },
      ]} />
    </div>
  );
}

function SlideTablet({ v }) {
  return (
    <div>
      <SlideHeader v={v} badge="현장 태블릿" badgeColor={v.amber} title="입고·출고 처리 전용" subtitle="창고 현장에서 작업자가 터치로 조작하는 단순 UI. 웹에서 등록한 예정만 처리 가능합니다." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 22 }}>
        <FeatureCard v={v} label="입고 처리"
          desc="웹에서 등록한 입고예정을 선택. 창고·열·단을 터치로 선택. 전동랙은 열기/멈춤으로 제어."
          color={v.amber} colorDim={v.amberDim}
          icon={(<><path d="M12 2L2 7l10 5 10-5-10-5z" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>)}
        />
        <FeatureCard v={v} label="출고 처리"
          desc="웹에서 등록한 출고예정을 선택. FIFO 로트가 자동 정렬. 로트 클릭 시 위치 자동 결정."
          color={v.red} colorDim={v.redDim}
          icon={(<><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>)}
        />
      </div>
      <StepList v={v} accentColor={v.amber} items={[
        { title: '현장 태블릿 접근', desc: '로그인 없이 바로 접근 가능. 입고·출고 탭으로 전환.' },
        { title: '입고: 웹 예정 선택', desc: '입고예정 카드를 선택. 상품·수량·예정일 정보 확인.' },
        { title: '입고: 위치 선택 후 처리', desc: '창고→랙→열→단 순서로 터치 선택. 빈 단 자동 매칭. 수량 입력 후 실행.' },
        { title: '출고: 웹 예정 선택', desc: '출고예정 카드를 선택. FIFO 배지와 납품처 정보 확인.' },
        { title: '출고: FIFO 로트 선택 후 처리', desc: '#1(최우선) 로트 자동 강조. 로트 클릭 시 출고 위치 자동 로드. 수량 입력 후 실행.' },
      ]} />
    </div>
  );
}

function SlideKiosk({ v }) {
  return (
    <div>
      <SlideHeader v={v} badge="키오스크 모니터" badgeColor={v.green} title="모니터링 + 전동랙 제어" subtitle="무인 창고 현장에 설치되는 고정 단말. 실시간 상태 표시 및 전동랙 원격 제어 기능을 제공합니다." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
        <FeatureCard v={v} label="실시간 시계"
          desc="HH:MM:SS + 요일 포함 날짜. 1초 간격 자동 갱신으로 원거리에서 쉽게 확인."
          color={v.cyan} colorDim={v.cyanDim}
          icon={(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>)}
        />
        <FeatureCard v={v} label="전동랙 연결 상태"
          desc="실시간 블루투스 연결 상태. 연결됨(파랑)·재시도(노랑)·실패(빨강)를 시각적으로 표시."
          color={v.amber} colorDim={v.amberDim}
          icon={(<><polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" /></>)}
        />
        <FeatureCard v={v} label="활동 로그"
          desc="모든 입고·출고 작업과 시스템 이벤트의 실시간 기록. 성공·정보·경고·오류 4단계로 표시."
          color={v.green} colorDim={v.greenDim}
          icon={(<><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></>)}
        />
        <FeatureCard v={v} label="전동랙 제어"
          desc="웹에서 로그인 시 입고·출고 화면에 전동랙 리모컨 추가. 터치로 원격 제어 가능."
          color={v.purple} colorDim={v.purpleDim}
          icon={(<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>)}
        />
      </div>
      <div style={{
        padding: '14px 18px',
        background: v.bgSubtle,
        border: `1px dashed ${v.border}`,
        borderRadius: 12,
        fontSize: '0.82rem',
        color: v.textSecondary,
        lineHeight: 1.7,
        wordBreak: 'keep-all',
      }}>
        키오스크는 <strong style={{ color: v.textPrimary }}>모니터링 전용</strong>으로 실행되거나, 웹에 로그인하면 <strong style={{ color: v.textPrimary }}>입고·출고 처리 + 전동랙 제어</strong> 모드로 전환됩니다. 실시간으로 창고 상황을 파악하고 현장에서 즉시 대응할 수 있습니다.
      </div>
    </div>
  );
}

function SlideUserManagement({ v }) {
  const roles = [
    {
      title: '수퍼 관리자',
      desc: '모든 권한을 보유. 일반관리자와 일반 사용자를 가입/삭제하고 등급을 자유롭게 변경할 수 있습니다.',
      color: v.cyan,
      colorDim: v.cyanDim,
    },
    {
      title: '일반 관리자',
      desc: '일반 사용자를 가입/삭제하고 권한을 부여할 수 있습니다. 활동 로그를 조회 가능하지만, 사용자 등급은 변경 불가.',
      color: v.amber,
      colorDim: v.amberDim,
    },
    {
      title: '일반',
      desc: '부여받은 권한 범위 내에서만 작업 가능. 활동 로그 조회는 불가하지만 자신의 작업 이력은 시스템에 기록됩니다.',
      color: v.green,
      colorDim: v.greenDim,
    },
  ];

  return (
    <div>
      <SlideHeader v={v} badge="관리자 웹 · 5/5" badgeColor={v.cyan} title="사용자 관리 및 권한 설정" subtitle="조직의 역할에 따라 3단계 관리자 등급과 세밀한 권한 제어를 통해 접근을 관리합니다." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
        {roles.map((role) => (
          <div key={role.title} style={{
            background: v.bgSubtle,
            border: `1px solid ${v.borderSubtle}`,
            borderLeft: `4px solid ${role.color}`,
            borderRadius: 12,
            padding: '18px 20px',
          }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: role.color, marginBottom: 6 }}>
              {role.title}
            </div>
            <div style={{ fontSize: '0.85rem', color: v.textSecondary, lineHeight: 1.6, wordBreak: 'keep-all' }}>
              {role.desc}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        padding: '16px 20px',
        background: v.bgSubtle,
        border: `1px solid ${v.borderSubtle}`,
        borderRadius: 12,
        fontSize: '0.82rem',
        color: v.textSecondary,
        lineHeight: 1.8,
        wordBreak: 'keep-all',
      }}>
        <div style={{ fontWeight: 700, color: v.textPrimary, marginBottom: 8 }}>권한 종류 (세밀한 CRUD 제어)</div>
        각 사용자마다 다음 권한을 개별 부여: 특정 창고 접근 · 입/출고예정(접근/추가/수정/삭제) · 재고(접근/추가/수정/삭제) · 상품(접근/추가/수정/삭제) · 로그 조회 등. 역할과 업무 범위에 맞춰 필요한 권한만 선택적으로 할당합니다.
      </div>
    </div>
  );
}

function SlideOutro({ v, onBack }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      minHeight: 420,
      padding: '40px 20px',
    }}>
      <IconBox v={v} color={v.green} colorDim={v.greenDim} size={88}>
        <polyline points="20 6 9 17 4 12" />
      </IconBox>
      <h2 style={{
        margin: '28px 0 0',
        fontSize: '2rem',
        fontWeight: 800,
        color: v.textPrimary,
        letterSpacing: '-0.02em',
        wordBreak: 'keep-all',
      }}>
        이상으로 사용 가이드를 마칩니다
      </h2>
      <div style={{
        marginTop: 16,
        fontSize: '0.95rem',
        color: v.textSecondary,
        lineHeight: 1.7,
        maxWidth: 520,
        wordBreak: 'keep-all',
      }}>
        플랫폼 선택 화면으로 돌아가 직접 시스템을 체험해보세요. 관리용 웹은 로그인 후 모든 기능을 사용할 수 있으며, 태블릿·키오스크는 바로 접근 가능합니다.
      </div>
      <button
        onClick={onBack}
        style={{
          marginTop: 32,
          padding: '14px 28px',
          borderRadius: 12,
          border: 'none',
          background: v.cyan,
          color: '#FFFFFF',
          fontSize: '0.95rem',
          fontWeight: 700,
          cursor: 'pointer',
          letterSpacing: '-0.01em',
          boxShadow: `0 8px 24px ${v.cyanDim}`,
        }}
      >
        플랫폼 선택으로 돌아가기 →
      </button>
    </div>
  );
}

export default function Presentation() {
  const navigate = useNavigate();
  const [theme, setTheme] = React.useState('light');
  const [index, setIndex] = React.useState(0);
  const v = theme === 'light' ? lightVars : darkVars;

  const slides = React.useMemo(() => ([
    { key: 'cover', render: (vv) => <SlideCover v={vv} /> },
    { key: 'platforms', render: (vv) => <SlidePlatforms v={vv} /> },
    { key: 'login', render: (vv) => <SlideLoginDashboard v={vv} /> },
    { key: 'inbound', render: (vv) => <SlideInbound v={vv} /> },
    { key: 'outbound', render: (vv) => <SlideOutbound v={vv} /> },
    { key: 'inventory', render: (vv) => <SlideInventory v={vv} /> },
    { key: 'tablet', render: (vv) => <SlideTablet v={vv} /> },
    { key: 'kiosk', render: (vv) => <SlideKiosk v={vv} /> },
    { key: 'users', render: (vv) => <SlideUserManagement v={vv} /> },
    { key: 'outro', render: (vv) => <SlideOutro v={vv} onBack={() => navigate('/')} /> },
  ]), [navigate]);

  const total = slides.length;
  const current = slides[index];

  const goPrev = React.useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const goNext = React.useCallback(() => setIndex((i) => Math.min(total - 1, i + 1)), [total]);

  React.useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); goPrev(); }
      else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); goNext(); }
      else if (e.key === 'Home') { e.preventDefault(); setIndex(0); }
      else if (e.key === 'End') { e.preventDefault(); setIndex(total - 1); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext, total]);

  const bgImage = theme === 'dark'
    ? [
        'radial-gradient(ellipse at 20% 50%, rgba(0,212,255,0.07) 0%, transparent 55%)',
        'radial-gradient(ellipse at 80% 50%, rgba(0,100,200,0.07) 0%, transparent 55%)',
        'linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)',
      ].join(', ')
    : 'none';

  return (
    <div style={{
      fontFamily: "'Noto Sans KR', sans-serif",
      backgroundColor: v.bgBase,
      backgroundImage: bgImage,
      backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
      minHeight: '100vh',
      color: v.textPrimary,
      transition: 'background-color 0.25s',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 상단 바 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: `1px solid ${v.border}`,
        background: `${v.bgPanel}CC`,
        backdropFilter: 'blur(6px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: `1px solid ${v.border}`,
            color: v.textSecondary,
            fontSize: '0.82rem',
            padding: '8px 14px',
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          ← 플랫폼 선택으로 돌아가기
        </button>
        <div style={{
          fontSize: '0.82rem',
          fontWeight: 600,
          color: v.cyan,
          letterSpacing: '0.05em',
        }}>
          YNK WMS 사용 가이드
        </div>
        <button
          onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            border: `1px solid ${v.border}`,
            background: v.bgPanel,
            color: v.textSecondary,
            cursor: 'pointer',
            fontSize: '1.05rem',
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      {/* 슬라이드 영역 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 880,
          background: v.bgPanel,
          border: `1px solid ${v.border}`,
          borderRadius: 20,
          padding: '44px 48px',
          boxShadow: theme === 'dark'
            ? '0 20px 60px rgba(0,0,0,0.35)'
            : '0 20px 60px rgba(15,23,42,0.08)',
          minHeight: 540,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}>
          {current.render(v)}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderTop: `1px solid ${v.border}`,
        background: `${v.bgPanel}CC`,
        backdropFilter: 'blur(6px)',
        gap: 12,
      }}>
        <button
          onClick={goPrev}
          disabled={index === 0}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            border: `1px solid ${v.border}`,
            background: v.bgPanel,
            color: index === 0 ? v.textSecondary : v.textPrimary,
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: index === 0 ? 'not-allowed' : 'pointer',
            opacity: index === 0 ? 0.4 : 1,
            transition: 'all 0.15s',
            minWidth: 100,
          }}
        >
          ← 이전
        </button>

        {/* 진행 표시 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flex: 1,
          justifyContent: 'center',
        }}>
          <div style={{
            display: 'flex',
            gap: 6,
          }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}번 슬라이드`}
                style={{
                  width: i === index ? 28 : 8,
                  height: 8,
                  borderRadius: 999,
                  border: 'none',
                  background: i === index ? v.cyan : v.border,
                  cursor: 'pointer',
                  transition: 'width 0.2s, background 0.2s',
                  padding: 0,
                }}
              />
            ))}
          </div>
          <div style={{
            fontSize: '0.82rem',
            color: v.textSecondary,
            fontVariantNumeric: 'tabular-nums',
            minWidth: 52,
            textAlign: 'center',
          }}>
            {index + 1} / {total}
          </div>
        </div>

        <button
          onClick={goNext}
          disabled={index === total - 1}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            border: `1px solid ${index === total - 1 ? v.border : v.cyan}`,
            background: index === total - 1 ? v.bgPanel : v.cyan,
            color: index === total - 1 ? v.textSecondary : '#FFFFFF',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: index === total - 1 ? 'not-allowed' : 'pointer',
            opacity: index === total - 1 ? 0.4 : 1,
            transition: 'all 0.15s',
            minWidth: 100,
          }}
        >
          다음 →
        </button>
      </div>
    </div>
  );
}
