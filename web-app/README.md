# Kiosk Web Application (React + Vite)

Vite와 React를 사용한 키오스크 웹 애플리케이션입니다.

## 설정

### 의존성 설치
```bash
npm install
```

### 개발 실행
```bash
npm run dev
```

Vite dev server가 `http://localhost:5173`에서 실행됩니다.

### 빌드
```bash
npm run build
```

빌드 결과는 `dist/` 폴더에 생성됩니다.

## 구조

```
src/
├── main.jsx     - React 진입점
├── App.jsx      - 메인 컴포넌트
├── App.css      - 스타일
└── index.css    - 전역 스타일
```

## Electron과의 통합

Electron 앱(`../kiosk`)은 개발 중에는 이 dev server를 불러오고,
프로덕션에서는 빌드된 파일을 사용합니다.
