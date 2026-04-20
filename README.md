# 창고 관리 시스템 (YNK WMS)

창고 내 상품의 입고/출고를 관리하고, 일반랙 및 전동랙을 포함한 다양한 창고 형태를 지원하는 통합 창고 관리 시스템입니다.

---

## 기술 스택

| 플랫폼 | 기술 | 비고 |
|--------|------|------|
| 웹 (SPA) | React 18 + Vite + Zustand + React Router v6 | HashRouter 기반 SPA |
| 키오스크 | HTML/JS 데모 | `demo/kiosk/` |
| 태블릿 | HTML/JS 데모 | `demo/tablet/` |

---

## 실행 방법

```bash
npm install
npm run dev    # 개발 서버 (localhost:5173)
npm run build  # 빌드 (dist/ 생성)
```

---

## 플랫폼 진입 흐름

앱 시작 → 로그인 → **플랫폼 선택** (웹 / 키오스크 / 태블릿) → 각 플랫폼 화면으로 이동

---

## 핵심 기능

- **입고 처리** — 예정 등록된 건만 실행 가능. 3D 랙 뷰에서 슬롯 선택 후 위치 지정
- **출고 처리** — FIFO(선입선출) 자동 적용. 출고 전 계획 미리보기 제공
- **재고 관리** — 상품별 합산 수량 표시, 위치/입고일별 상세 조회
- **창고 3D 뷰** — CSS 3D transform 기반 랙 미니맵 + 랙 상세 뷰(2단계 혼합)
- **권한 관리** — 창고 단위 × 기능 단위 × 액션 단위 세분화
- **활동 로그** — admin 이상 열람 가능, developer 계정 액션은 기록 제외

---

## 비즈니스 규칙

- 입고/출고는 **사전 예정 등록**이 완료된 건에 한해 실행 가능
- 같은 상품이라도 **입고일이 다르면 별도 재고 아이템**으로 관리
- 출고 시 **FIFO** 원칙 자동 적용 (`received_at` 오름차순)
- 파레트에는 **서로 다른 상품 혼적 가능**
- 슬롯당 **파레트 1개** 제한

---

## 창고/위치 구조

```
창고 (Warehouse)
 └─ 랙 (Rack) × N
     └─ 층 (Floor) × N
         └─ 그룹/슬롯 (Group) × N
             └─ 파레트 (Pallet) — 슬롯당 최대 1개
                 └─ 재고 아이템 (Inventory Item) × N  ← 혼적 가능
```

위치 표현 예시: `창고1 > 3번랙 > 4층 > 2번`

---

## 사용자 권한 체계

| 등급 | 설명 |
|------|------|
| `developer` | 최고 권한, 활동 로그 미기록, 클라이언트 화면 비노출 |
| `super_admin` | 모든 기능 접근 + 전체 계정 승인 |
| `admin` | 사용자 계정 승인 + 권한 부여 |
| `user` | 부여받은 권한 내에서만 활동 |

---

## 데모

`demo/` 폴더의 HTML 파일을 브라우저에서 직접 열어 확인할 수 있습니다.

| 파일 | 설명 |
|------|------|
| `demo/index.html` | 로그인 화면 |
| `demo/inbound-schedule.html` | 입고 예정 목록 |
| `demo/inbound-execute.html` | 입고 처리 (3D 랙 뷰) |
| `demo/outbound-schedule.html` | 출고 예정 목록 |
| `demo/outbound-execute.html` | 출고 처리 (3D 랙 뷰) |
| `demo/inventory.html` | 재고 리스트 |
| `demo/products.html` | 상품 리스트 |
| `demo/activity-log.html` | 활동 로그 |
| `demo/users.html` | 사용자 관리 |

---

## 프로젝트 문서

- [설계 문서](docs/superpowers/specs/2026-04-16-warehouse-management-design.md) — 시스템 설계, DB 스키마, 화면 흐름 상세
