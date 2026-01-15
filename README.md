# 🍽️ Maechu v2 - 점심 메뉴 추천 서비스

네이버 지도 북마크를 활용한 **웹 기반** 점심 메뉴 추천 서비스

## 🚀 Render.com 배포 가이드

### 1. 환경 변수 설정

Render.com 대시보드에서 다음 환경 변수를 설정하세요:

```
PORT=10000
SERVER_URL=https://your-app-name.onrender.com
NAVER_MAP_FOLDER_ID=your_naver_map_folder_id_here
```

### 2. 네이버 지도 폴더 ID 찾는 방법

1. 네이버 지도 접속 → "내 장소" → "저장한 장소"
2. 점심 식당들이 저장된 폴더 선택
3. "공유" 버튼 클릭하여 공유 링크 생성
4. 링크에서 ID 추출: `https://map.naver.com/p/favorite/myPlace/folder/[여기가_폴더_ID]`

### 3. 자동 메뉴 업데이트 및 알림

- **메뉴 동기화**: 매일 오전 9시 (KST) - 네이버 지도 데이터 동기화
- **점심 알림**: 매일 오전 11시 30분 (KST) - Microsoft Teams 채널로 점심 추천 알림 전송 (GitHub Actions)
- **수동 실행**:
    - 메뉴 동기화: `npm run fetch-menus`
    - 알림 테스트: `node scripts/notify-teams.js`

## 🌐 웹 인터페이스 사용법

### 1. 웹 브라우저에서 접속

배포된 서비스 주소에 `/web`을 추가하여 접속:
```
https://your-app-name.onrender.com/web
```

### 2. 주요 기능

- **🎲 점심 메뉴 추천받기**: 저장된 맛집 중에서 랜덤 추천
- **📋 전체 식당 목록**: 네이버 지도에 저장된 모든 식당 보기
- **🗺️ 지도 연동**: 추천받은 식당을 바로 네이버 지도에서 확인

### 3. PWA 지원

- 모바일 브라우저에서 "홈 화면에 추가" 가능
- 앱처럼 사용할 수 있는 Progressive Web App
- 오프라인에서도 기본 기능 이용 가능

### 4. 키보드 단축키

- `Enter` 또는 `Space`: 점심 메뉴 추천받기
- `Escape`: 메인 화면으로 돌아가기

## 📁 프로젝트 구조

```
maechu_v2/
├── scripts/
│   └── fetch-menus.js          # 네이버 지도 데이터 동기화
├── src/
│   ├── core/                   # 코어 설정 (Fastify, 미들웨어)
│   ├── features/
│   │   └── lunch/             # 점심 추천 로직
│   └── routes/                # 라우팅 설정
├── public/                    # 웹 인터페이스 정적 파일
│   ├── index.html            # 메인 웹페이지
│   ├── styles.css            # 스타일시트
│   ├── script.js             # JavaScript 로직
│   ├── manifest.json         # PWA 매니페스트
│   └── sw.js                 # 서비스 워커
├── render.yaml               # Render.com 배포 설정
└── server.js                 # 메인 서버 파일
```

## 🔧 로컬 개발

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에서 NAVER_MAP_FOLDER_ID 설정

# 메뉴 데이터 가져오기
npm run fetch-menus

# 서버 실행
npm start
```

## 📝 API 엔드포인트

### 웹 인터페이스
- `GET /web` - 메인 웹페이지
- `GET /api/lunch` - 웹용 점심 추천 API (JSON)
- `GET /api/restaurants` - 식당 목록 API (JSON)

### 공통
- `GET /` - 헬스체크 및 서비스 정보
- `GET /awake` - 상태 확인 