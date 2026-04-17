## 절대 원칙 (AI 작업 시 반드시 준수)

### 제1원칙 — DB 작업 및 테스트 실행 금지
- 데이터베이스와 관련된 작업(마이그레이션, 시더, 스키마 변경 등)은 절대 수행하지 않는다.
- DB 관련 CLI 명령(migrate, seed 등)은 절대 실행하지 않는다.
- 테스트 코드(phpunit, pytest, jest 등)를 무단으로 실행하지 않는다.

### 제2원칙 — CLI 명령은 반드시 허가 후 실행
- 부수 효과가 있는 CLI 명령(배포, 패키지 설치, DB 조작 등)은 반드시 사용자 허가 후 실행한다.
- 읽기 전용 명령(ls, cat, git log, git diff 등)은 허가 없이 실행 가능하다.

### 제3원칙 — .env 및 민감 파일 절대 수정/커밋 금지
- `.env`, `.env.*` 등 환경변수 파일은 절대 수정하거나 커밋하지 않는다.
- `.gitignore`에 등록된 파일은 절대 커밋하지 않는다.

---

## 코드베이스 검색 규칙 (QMD 강제 사용)

코드베이스에서 파일, 클래스, 함수, 키워드를 검색할 때 **반드시 `qmd search` 또는 `qmd query`를 먼저 실행**한다.
Grep, Glob 등 자체 검색 도구는 qmd 검색 결과가 불충분할 때만 보조로 사용한다.

```bash
qmd search "검색어"     # 키워드 검색 (빠름, 정확한 단어 매칭)
qmd query "자연어 질문"  # 시맨틱 검색 (의미 기반)
```

### 적용 규칙
- 특정 기능/클래스/메서드 위치 → `qmd search "클래스명"`
- 특정 동작 방식/구현 파악 → `qmd query "자연어 설명"`
- 코드 변경 전 관련 파일 파악 → `qmd search` 먼저 실행
- qmd 결과가 0건이거나 불충분한 경우에만 Grep/Glob 허용

### 인덱스 갱신
- 파일을 생성/수정/삭제한 후 `qmd update`를 실행하여 인덱스를 최신 상태로 유지한다.

---

## 멀티 에이전트 워크플로 (iTerm2)

- 에이전트가 **2개 이상**이면 iTerm2 화면을 에이전트 수만큼 수직 분할(vertical split)하여 각 에이전트의 진행을 창별로 표시한다.
- 에이전트가 **1개**이면 메인 스레드에서 그냥 실행한다. 화면 분할 없음.
- 각 에이전트 작업이 완료되면 해당 창을 닫는다.
- 분할 명령 예시 (AppleScript / iTerm2 API):
  ```bash
  osascript -e 'tell application "iTerm2" to tell current window to tell current session to split vertically with default profile'
  ```

---

## 창고(Warehouse) 관련 파일 목록

창고 기능 수정 시 아래 파일만 스캔하면 된다. 전체 코드베이스 탐색 불필요.

### 공유 데이터 / 스타일
| 파일 | 역할 |
|------|------|
| `demo/data.js` | 창고·랙·재고·팔레트 데이터, `max_rack_count` 상수 |
| `demo/warehouse-styles.js` | 창고 공통 CSS 주입 (rack-matrix, rm-cell, label-cell 등) |
| `demo/shared.js` | 공통 유틸 (사이드바, 테마 등) |

### 재고 리스트
| 파일 | 역할 |
|------|------|
| `demo/inventory.html` | 목록형 + 창고형(Type A / Type B) 뷰, 상품 클릭 시 위치 강조 |

### 입고 처리
| 파일 | 역할 |
|------|------|
| `demo/samples/type-b/inbound-execute.html` | Type B 전동랙 입고, 셀/칸 선택, 팔레트 배치 |
| `demo/samples/type-a/inbound-execute.html` | Type A 일반 창고 입고 |
| `demo/inbound-execute.html` | 메인 입고 화면 (라우팅/분기) |
| `demo/inbound-schedule.html` | 입고 예정 목록 |

### 출고 처리
| 파일 | 역할 |
|------|------|
| `demo/samples/type-b/outbound-execute.html` | Type B 전동랙 출고, FIFO 강조, 층+칸 포인트 |
| `demo/samples/type-a/outbound-execute.html` | Type A 일반 창고 출고 |
| `demo/outbound-execute.html` | 메인 출고 화면 |
| `demo/outbound-schedule.html` | 출고 예정 목록 |

### 주요 CSS 클래스 / JS 패턴
- `renderTypeB()` — Type B 창고 매트릭스 렌더링 (inventory.html)
- `renderMatrix()` — 입고/출고 매트릭스 렌더링 (inbound/outbound execute)
- `getMiniBlocksOutbound()` — 출고용 미니블록 (FIFO 색상)
- `--rm-cell-size` CSS 변수 — 셀 너비 (기준: `max_rack_count = 30`)
- `rm-selected` — 층 포인트 (셀 테두리 강조)
- `mini-sel / mini-fifo1/2/n` — 칸 포인트 (미니블록 색상)
- `rm-na` — 존재하지 않는 층 (pointer-events: none)

---

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (90-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk vitest run          # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%)
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->
