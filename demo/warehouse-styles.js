// ============================================================
// 창고 시각화 통합 CSS — Type A (카드), Type B (매트릭스)
// 모든 화면(입고/출고/재고)에서 공유
// ============================================================

function getWarehouseStyles() {
  return `
    /* ════════════════════════════════════════════════════════════
       TYPE A: 랙 카드 방식 (평면 그리드)
       ════════════════════════════════════════════════════════════ */

    /* 창고 컨테이너 */
    .wh3d-container {
      background: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .wh3d-scroll {
      overflow-x: auto;
    }

    /* 창고 제목 */
    .wh3d-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .wh3d-title .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--cyan);
      box-shadow: 0 0 8px rgba(0,212,255,0.8);
    }

    .wh3d-scene {
      display: block;
    }

    .wh3d-grid {
      display: grid;
      gap: 8px;
    }

    /* 랙 카드 */
    .rack-card {
      background: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px;
      cursor: pointer;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    }

    .rack-card:hover {
      border-color: var(--border-bright);
      background: var(--bg-hover);
    }

    .rack-card.selected {
      border-color: var(--cyan);
      box-shadow: 0 0 14px rgba(0,212,255,0.45);
      background: var(--bg-base);
    }

    /* 카드 헤더 */
    .rack-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .rack-card-no {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--text-primary);
      font-family: 'JetBrains Mono', monospace;
    }

    .rack-card.selected .rack-card-no {
      color: var(--cyan);
    }

    .rack-card-lot {
      font-size: 0.68rem;
      font-weight: 600;
      color: #4ADE80;
    }

    .rack-card-lot.empty {
      color: #334155;
    }

    /* 셀 그리드 */
    .rack-cell-grid {
      display: grid;
      gap: 2px;
    }

    /* 개별 셀 (높이: 9px) */
    .rc {
      border-radius: 2px;
      height: 9px;
    }

    .rc-empty {
      background: var(--bg-surface);
      border: 1px solid rgba(30,58,95,0.45);
    }

    .rc-filled {
      background: rgba(55,48,163,0.35);
      border: 1px solid #6366F1;
    }

    .rc-highlight {
      background: rgba(0,212,255,0.5) !important;
      border: 1px solid var(--cyan) !important;
    }

    .rc-occupied {
      background: var(--bg-hover);
      border: 1px solid var(--border);
    }

    .rc-fifo1 {
      background: rgba(239,68,68,0.65);
      border: 1px solid rgba(239,68,68,0.95);
    }

    .rc-fifo2 {
      background: rgba(245,158,11,0.55);
      border: 1px solid rgba(245,158,11,0.85);
    }

    .rc-fifon {
      background: rgba(0,212,255,0.35);
      border: 1px solid rgba(0,212,255,0.65);
    }

    /* 범례 */
    .legend {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-top: 14px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
      color: var(--text-secondary);
    }

    .legend-box {
      width: 14px;
      height: 14px;
      border-radius: 2px;
    }

    /* 슬롯 그리드 (입고 처리 상세 뷰) */
    .slot-grid {
      display: grid;
      gap: 6px;
      margin-top: 12px;
    }

    .slot {
      width: 60px;
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
    }

    .slot-empty {
      background: var(--bg-panel);
      border-style: dashed;
      color: var(--text-secondary);
    }

    .slot-filled {
      background: var(--cyan-dim);
      border-color: var(--cyan);
      color: var(--cyan);
      box-shadow: var(--cyan-glow);
    }

    .slot-selected {
      background: rgba(0,212,255,0.3);
      border-color: var(--cyan);
      box-shadow: 0 0 20px rgba(0,212,255,0.6);
    }

    .slot:hover {
      transform: scale(1.1);
      z-index: 5;
    }

    .floor-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      padding-right: 8px;
      font-family: 'JetBrains Mono', monospace;
    }

    /* ════════════════════════════════════════════════════════════
       TYPE B: 매트릭스 방식 (테이블 그리드)
       ════════════════════════════════════════════════════════════ */

    /* 매트릭스 컨테이너 */
    .matrix-section {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      min-height: 0;
      gap: 10px;
      padding: 10px 0;
    }

    .matrix-scroll {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      overflow: auto;
      flex: 1 1 auto;
    }

    /* 매트릭스 테이블 */
    .rack-matrix,
    .rm-table {
      border-collapse: collapse;
      font-family: 'JetBrains Mono', monospace;
      width: max-content;
      margin: 0 auto;
    }

    .rack-matrix thead th,
    .rm-table thead th {
      background: #09131F;
      padding: 5px 6px;
      text-align: center;
      font-size: 0.68rem;
      font-weight: 700;
      color: #5A7A9A;
      border: 1px solid rgba(30,58,95,0.6);
      white-space: nowrap;
      position: sticky;
      top: 0;
      z-index: 2;
    }

    .rack-matrix thead th:not(.label-cell),
    .rm-table thead th:not(.label-cell) {
      min-width: var(--rm-cell-size, 42px);
      width: var(--rm-cell-size, 42px);
    }

    .rack-matrix tbody td:not(.label-cell),
    .rm-table tbody td:not(.label-cell) {
      width: var(--rm-cell-size, 42px);
    }

    .rack-matrix tfoot td,
    .rm-table tfoot td {
      background: #06101A;
      padding: 4px 6px;
      text-align: center;
      font-size: 0.65rem;
      font-weight: 600;
      color: #4A6A8A;
      border: 1px solid rgba(30,58,95,0.4);
      white-space: nowrap;
    }

    .rack-matrix tfoot td:not(.label-cell),
    .rm-table tfoot td:not(.label-cell) {
      width: var(--rm-cell-size, 42px);
    }

    /* 라벨 컬럼 (고정) */
    .label-cell {
      padding: 4px 6px;
      text-align: center;
      font-size: 0.68rem;
      font-weight: 700;
      color: #6A8AAA;
      background: #060F1A;
      white-space: nowrap;
      border: 1px solid rgba(30,58,95,0.5);
      border-right: 1px solid var(--border) !important;
      min-width: 50px;
    }

    thead .label-cell {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 3;
    }

    tbody .label-cell {
      position: sticky;
      left: 0;
      z-index: 1;
    }

    tfoot .label-cell {
      position: sticky;
      left: 0;
      z-index: 1;
      background: #06101A;
    }

    .rack-matrix td {
      padding: 0;
      border: 1px solid rgba(20,40,70,0.5);
    }

    /* 매트릭스 셀 */
    .rm-cell {
      width: 100%;
      aspect-ratio: 1 / 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.12s;
      font-size: 0.68rem;
      font-weight: 700;
      line-height: 1.2;
      font-family: 'JetBrains Mono', monospace;
    }

    /* 셀 상태: 없음 */
    .rm-na {
      background: #030A14;
      color: #0D1F35;
      cursor: default;
    }

    /* 셀 상태: 비어있음 */
    .rm-empty {
      background: #05101C;
      color: #1E3A5F;
    }

    .rm-empty:hover {
      background: #0A1A2E;
    }

    /* 셀 상태: 점유율별 채움 (입고) */
    .rm-fill-1 {
      background: rgba(30,80,200,0.2);
      color: #7BAAE8;
    }

    .rm-fill-2 {
      background: rgba(30,80,200,0.4);
      color: #AACCF8;
    }

    .rm-fill-3 {
      background: rgba(30,80,200,0.65);
      color: #D0E4FF;
    }

    .rm-full {
      background: rgba(30,80,200,0.88);
      color: #EFF6FF;
    }

    /* 셀 상태: 선택됨 */
    .rm-selected {
      background: rgba(0,212,255,0.22) !important;
      color: var(--cyan) !important;
      outline: 2px solid var(--cyan);
      outline-offset: -1px;
    }

    /* 셀 상태: 점유됨 (출고) */
    .rm-occupied {
      background: #0B1A2A;
      color: #3A5A7A;
    }

    /* 셀 상태: FIFO 순서 (출고 전용) */
    .rm-fifo1 {
      background: rgba(239,68,68,0.5);
      color: #FCA5A5;
      border: 1px solid rgba(239,68,68,0.8) !important;
    }

    .rm-fifo2 {
      background: rgba(245,158,11,0.4);
      color: #FCD34D;
      border: 1px solid rgba(245,158,11,0.7) !important;
    }

    .rm-fifon {
      background: rgba(0,212,255,0.25);
      color: var(--cyan);
      border: 1px solid rgba(0,212,255,0.5) !important;
    }

    /* 셀 hover */
    .rm-cell:not(.rm-na):hover {
      filter: brightness(1.4);
      z-index: 2;
      transform: scale(1.08);
    }

    /* 테이블 행 hover 비활성화 */
    .rack-matrix tr:hover td,
    .rm-table tr:hover td {
      background: unset;
    }

    /* 더미 셀 (정렬용) */
    .rm-dummy {
      background: #030A14;
      color: #0D1F35;
      cursor: default;
      pointer-events: none;
    }

    .rm-dummy-th {
      background: #06101A;
      color: #0D1F35;
      border: 1px solid rgba(30,58,95,0.3) !important;
      min-width: 42px;
    }

    /* 셀 상세 패널 */
    .cell-details {
      flex: 0 0 auto;
      height: 200px;
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--border);
      background: #060F1A;
      padding: 10px 14px;
    }

    .cell-details .cd-empty {
      color: var(--text-secondary);
      font-size: 0.78rem;
      text-align: center;
      padding: 20px 0;
    }

    .cell-details .cd-header {
      flex: 0 0 auto;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--cyan);
      margin-bottom: 8px;
      font-family: 'JetBrains Mono', monospace;
    }

    .cell-details .cd-table-wrap {
      flex: 1 1 auto;
      overflow: auto;
    }

    .cell-details table.cd-table {
      width: 100%;
      border-collapse: collapse;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
    }

    .cell-details table.cd-table thead th {
      background: #09131F;
      padding: 5px 8px;
      text-align: left;
      font-size: 0.7rem;
      font-weight: 700;
      color: #5A7A9A;
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .cell-details table.cd-table tbody td {
      padding: 4px 8px;
      border-bottom: 1px solid rgba(30,58,95,0.3);
      color: var(--text-primary);
    }

    .cell-details table.cd-table tbody tr:hover td {
      background: #0A1420;
    }

    .cell-details table.cd-table tr.cd-empty-row td {
      color: #3A5A7A;
      font-style: italic;
    }

    .cd-dan-header {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--amber);
      padding: 4px 8px;
      background: #0A1828;
      border-left: 2px solid var(--amber);
    }

    /* 통계 바 */
    .stats-bar {
      flex-shrink: 0;
      padding: 7px 14px;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 0;
      background: #060F1A;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 0 16px;
      border-right: 1px solid var(--border);
    }

    .stat-item:first-child {
      padding-left: 0;
    }

    .stat-item:last-child {
      border-right: none;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .stat-value {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 0.95rem;
    }

    .stat-unit {
      font-size: 0.68rem;
      color: var(--text-secondary);
    }

    /* 액션 바 */
    .action-bar {
      flex-shrink: 0;
      padding: 8px 14px;
      border-bottom: 1px solid var(--border);
      background: #0A1420;
      display: flex;
      align-items: center;
      gap: 10px;
      height: auto;
    }

    .action-info {
      flex: 1;
      font-size: 0.82rem;
      color: var(--text-secondary);
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .action-highlight {
      color: var(--cyan);
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }

    .dan-selector {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .dan-btn {
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 0.72rem;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      cursor: pointer;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      color: var(--text-secondary);
      transition: all 0.12s;
    }

    .dan-btn:hover:not(:disabled) {
      border-color: var(--border-bright);
      color: var(--text-primary);
    }

    .dan-btn.active {
      background: var(--cyan-dim);
      border-color: var(--cyan);
      color: var(--cyan);
    }

    .dan-btn.occupied {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .btn-exec {
      padding: 7px 18px;
      border-radius: 5px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      border: none;
      background: #10B981;
      color: #000;
      flex-shrink: 0;
      transition: all 0.15s;
    }

    .btn-exec:disabled {
      background: var(--bg-surface);
      color: #334155;
      cursor: not-allowed;
    }

    .btn-exec:not(:disabled):hover {
      filter: brightness(1.1);
    }

    /* 재고 범례 배지 (출고 전용) */
    .lg-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.72rem;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }

    .lg-stock {
      background: rgba(59,130,246,0.2);
      color: #93C5FD;
      border: 1px solid rgba(59,130,246,0.4);
    }

    .lg-inbound {
      background: rgba(245,158,11,0.2);
      color: #FCD34D;
      border: 1px solid rgba(245,158,11,0.4);
    }

    .lg-outbound {
      background: rgba(239,68,68,0.2);
      color: #FCA5A5;
      border: 1px solid rgba(239,68,68,0.4);
    }

    .lg-after {
      background: rgba(16,185,129,0.2);
      color: #6EE7B7;
      border: 1px solid rgba(16,185,129,0.4);
    }

    /* 창고 탭 */
    .wh-tab {
      padding: 4px 12px;
      border-radius: 5px;
      font-size: 0.8rem;
      cursor: pointer;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      color: var(--text-secondary);
      transition: all 0.15s;
    }

    .wh-tab.active {
      background: var(--cyan);
      color: #000;
      font-weight: 700;
      border-color: var(--cyan);
    }

    .wh-tabs-row {
      padding: 8px 14px;
      border-bottom: 1px solid var(--border);
      display: flex;
      gap: 6px;
      flex-shrink: 0;
      background: var(--bg-panel);
      align-items: center;
      height: auto;
    }

    /* 예정 목록 스크롤 */
    .sched-section {
      flex-shrink: 0;
      border-bottom: 1px solid var(--border);
      background: #080F1A;
      overflow: hidden;
    }

    .sched-scroll {
      display: flex;
      gap: 6px;
      padding: 8px 14px;
      overflow-x: auto;
    }

    .sched-scroll::-webkit-scrollbar {
      height: 4px;
    }

    .sched-scroll::-webkit-scrollbar-track {
      background: transparent;
    }

    .sched-scroll::-webkit-scrollbar-thumb {
      background: var(--border-bright);
      border-radius: 2px;
    }

    .sched-card {
      flex-shrink: 0;
      padding: 7px 11px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      cursor: pointer;
      transition: all 0.15s;
      min-width: 130px;
    }

    .sched-card:hover {
      border-color: var(--border-bright);
      background: var(--bg-hover);
    }

    .sched-card.selected {
      border-color: var(--cyan);
      background: var(--cyan-dim);
    }

    .sched-card-name {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .sched-card.selected .sched-card-name {
      color: var(--cyan);
    }

    .sched-card-meta {
      font-size: 0.7rem;
      color: var(--text-secondary);
      margin-top: 2px;
      display: flex;
      gap: 4px;
    }

    .sched-note {
      color: var(--amber);
      font-weight: 600;
    }

    /* ════════════════════════════════════════════════════════════
       라이트 테마 오버라이드
       ════════════════════════════════════════════════════════════ */

    [data-theme="light"] .wh3d-container {
      background: var(--bg-panel);
      border-color: var(--border);
    }

    [data-theme="light"] .rack-card {
      background: #F8FAFC;
      border-color: var(--border);
    }

    [data-theme="light"] .rack-card:hover {
      background: var(--bg-hover);
      border-color: var(--border-bright);
    }

    [data-theme="light"] .rack-card.selected {
      background: #EFF6FF;
    }

    [data-theme="light"] .rc-empty {
      background: #E2E8F0;
      border-color: rgba(148,163,184,0.6);
    }

    [data-theme="light"] .rc-filled {
      background: rgba(55,48,163,0.25);
      border-color: rgba(99,102,241,0.6);
    }

    [data-theme="light"] .rc-occupied {
      background: #CBD5E1;
      border-color: rgba(148,163,184,0.6);
    }

    [data-theme="light"] .rc-fifo1 {
      background: rgba(239,68,68,0.2);
      border-color: rgba(239,68,68,0.5);
    }

    [data-theme="light"] .rc-fifo2 {
      background: rgba(245,158,11,0.15);
      border-color: rgba(245,158,11,0.5);
    }

    [data-theme="light"] .rc-fifon {
      background: rgba(2,132,199,0.12);
      border-color: rgba(2,132,199,0.4);
    }

    [data-theme="light"] .slot-empty {
      background: var(--bg-surface);
    }

    [data-theme="light"] .sched-section {
      background: var(--bg-surface);
    }

    [data-theme="light"] .action-bar {
      background: var(--bg-hover);
    }

    [data-theme="light"] .rack-matrix thead th,
    [data-theme="light"] .rm-table thead th {
      background: var(--bg-surface);
      color: var(--text-secondary);
      border-color: var(--border);
    }

    [data-theme="light"] .rack-matrix tfoot td,
    [data-theme="light"] .rm-table tfoot td {
      background: var(--bg-surface);
      color: var(--text-secondary);
      border-color: var(--border);
    }

    [data-theme="light"] .label-cell {
      background: var(--bg-hover);
      color: var(--text-secondary);
      border-color: var(--border);
    }

    [data-theme="light"] tfoot .label-cell {
      background: var(--bg-hover);
    }

    [data-theme="light"] .rack-matrix td,
    [data-theme="light"] .rm-table td {
      border-color: var(--border);
    }

    [data-theme="light"] .rm-na {
      background: var(--bg-hover);
      color: var(--border-bright);
    }

    [data-theme="light"] .rm-empty {
      background: #F1F5F9;
      color: #94A3B8;
    }

    [data-theme="light"] .rm-empty:hover {
      background: #E2E8F0;
    }

    [data-theme="light"] .rm-fill-1 {
      background: rgba(59,130,246,0.15);
      color: #2563EB;
    }

    [data-theme="light"] .rm-fill-2 {
      background: rgba(59,130,246,0.3);
      color: #1D4ED8;
    }

    [data-theme="light"] .rm-fill-3 {
      background: rgba(59,130,246,0.5);
      color: #1E40AF;
    }

    [data-theme="light"] .rm-full {
      background: rgba(59,130,246,0.75);
      color: #DBEAFE;
    }

    [data-theme="light"] .rm-occupied {
      background: #E2E8F0;
      color: #64748B;
    }

    [data-theme="light"] .rm-fifo1 {
      background: rgba(239,68,68,0.15);
      color: #DC2626;
      border: 1px solid rgba(239,68,68,0.5) !important;
    }

    [data-theme="light"] .rm-fifo2 {
      background: rgba(245,158,11,0.15);
      color: #D97706;
      border: 1px solid rgba(245,158,11,0.5) !important;
    }

    [data-theme="light"] .rm-fifon {
      background: rgba(2,132,199,0.12);
      color: #0284C7;
      border: 1px solid rgba(2,132,199,0.4) !important;
    }

    [data-theme="light"] .stats-bar {
      background: var(--bg-surface);
    }

    [data-theme="light"] .cell-details {
      background: var(--bg-panel);
    }

    [data-theme="light"] .cell-details table.cd-table thead th {
      background: var(--bg-surface);
      color: var(--text-secondary);
    }

    [data-theme="light"] .cell-details table.cd-table tbody tr:hover td {
      background: var(--bg-hover);
    }

    [data-theme="light"] .cd-dan-header {
      background: var(--bg-surface);
      color: var(--amber);
    }

    [data-theme="light"] .rm-dummy {
      background: var(--bg-hover);
      color: var(--border);
    }

    [data-theme="light"] .rm-dummy-th {
      background: var(--bg-surface);
      color: var(--border);
    }
  `;
}
