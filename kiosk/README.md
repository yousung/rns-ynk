# Kiosk Application (Electron)

Electron 기반 키오스크 애플리케이션입니다.

## 설정

### 의존성 설치
```bash
npm install
```

### 개발 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

## 구조

- `src/main.js` - Electron 메인 프로세스
- `src/preload.js` - Preload 스크립트 (보안)

## 웹 애플리케이션 통합

개발 환경에서는 `http://localhost:5173` (web 폴더의 Vite dev server)에서 웹 앱을 불러옵니다.
프로덕션 환경에서는 `web/dist/` 폴더의 빌드된 파일을 사용합니다.

## 환경 변수

`.env` 파일을 생성하여 필요한 환경 변수를 설정합니다.
