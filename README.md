# 🍽️ Maechu v2 - 점심 메뉴 추천 봇

네이버 지도 북마크를 활용한 **Microsoft Teams** 점심 메뉴 추천 봇  
**Power Automate Workflows** 지원 ⚡

## 🚀 Render.com 배포 가이드

### 1. 환경 변수 설정

Render.com 대시보드에서 다음 환경 변수를 설정하세요:

```
PORT=10000
SERVER_URL=https://your-app-name.onrender.com
NAVER_MAP_FOLDER_ID=your_naver_map_folder_id_here
TEAMS_BOT_ID=lunch-recommend-bot-v2
TEAMS_APP_PACKAGE=com.maechu.lunchbot
```

### 2. 네이버 지도 폴더 ID 찾는 방법

1. 네이버 지도 접속 → "내 장소" → "저장한 장소"
2. 점심 식당들이 저장된 폴더 선택
3. "공유" 버튼 클릭하여 공유 링크 생성
4. 링크에서 ID 추출: `https://map.naver.com/p/favorite/myPlace/folder/[여기가_폴더_ID]`

### 3. 자동 메뉴 업데이트

- **Cron Job**: 매일 오전 9시에 자동으로 네이버 지도에서 최신 식당 정보 동기화
- **수동 실행**: `npm run fetch-menus`

## 🤖 Microsoft Teams 연동 가이드

### 1. Power Automate Workflows 설정 (권장)

Microsoft Teams에서 Office 365 Connectors가 은퇴되면서 **Power Automate Workflows**로 전환:

#### 단계별 설정:

1. **Teams 채널에서 Workflows 앱 설치**
   - 채널 → "..." → "Workflows" 선택
   - "Post to a channel when a webhook request is received" 템플릿 선택

2. **Power Automate에서 Flow 편집**
   - 템플릿 대신 커스텀 Flow 생성 권장
   - 트리거: "When a Teams webhook request is received"
   - 액션: "Post card in a chat or channel"

3. **웹훅 URL 설정**
   ```
   ${SERVER_URL}/teams/lunch
   예: https://maechu-v2-whmc.onrender.com/teams/lunch
   ```

#### 예시 Power Automate Flow:
```
1. When a Teams webhook request is received
2. Post card in a chat or channel
   - Adaptive Card: triggerBody()
```

### 2. 사용법

1. **Power Automate Workflow 트리거**
   - HTTP POST 요청으로 `/teams/lunch` 호출
   - 자동으로 Adaptive Card 형태로 응답

2. **Adaptive Card 기능**:
   - 🗺️ **지도에서 보기**: 네이버 지도 직접 링크
   - 📋 **전체 리스트**: 저장된 식당 폴더 보기

### 3. 은퇴 일정 (중요!)

- **2024년 12월 31일**: 기존 Office 365 Connectors URL 업데이트 필요
- **2025년 12월**: 완전 은퇴, Power Automate 전환 필수

## 📁 프로젝트 구조

```
maechu_v2/
├── scripts/
│   └── fetch-menus.js          # 네이버 지도 데이터 동기화
├── src/
│   ├── core/                   # 코어 설정 (Fastify, 미들웨어)
│   ├── features/
│   │   ├── dooray/            # Dooray/Team 웹훅 처리
│   │   └── lunch/             # 점심 추천 로직
│   └── routes/                # 라우팅 설정
├── render.yaml                # Render.com 배포 설정
└── server.js                  # 메인 서버 파일
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

### 공통
- `GET /` - 헬스체크
- `GET /awake` - 상태 확인

### Microsoft Teams (권장)
- `POST /teams/lunch` - Teams Adaptive Card 점심 추천
- `GET /teams/lunch` - Teams Adaptive Card 점심 추천 (GET 지원)
- `GET /teams/health` - Teams 서비스 상태 확인

### Dooray (레거시)
- `POST /dooray/lunch/simple` - Dooray 점심 추천
- `POST /dooray/callbacks` - Dooray 웹훅 처리 