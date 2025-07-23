# Microsoft Teams Power Automate 설정 가이드

## 🚀 **1단계: Render.com 배포**

1. GitHub에 코드 푸시
2. Render.com에서 새 Web Service 생성
3. 환경 변수 설정:
   ```
   PORT=10000
   NAVER_MAP_FOLDER_ID=your_folder_id
   ```

배포 완료 후 URL: `https://your-app-name.onrender.com`

## 🤖 **2단계: Microsoft Teams에서 Power Automate 설정**

### 방법 1: Teams에서 직접 설정 (간단)

1. **Teams 채널 선택**
   - 점심 추천을 받을 채널로 이동
   - 채널명 옆 "..." 클릭 → "Workflows" 선택

2. **템플릿 선택**
   - "Post to a channel when a webhook request is received" 검색
   - 해당 템플릿 선택

3. **Flow 설정**
   - Team과 Channel 확인
   - "Create" 클릭
   - 생성된 Webhook URL 복사 (나중에 사용)

### 방법 2: Power Automate에서 커스텀 설정 (권장)

1. **make.powerautomate.com 접속**

2. **새 Flow 생성**
   - "Create" → "Instant cloud flow"
   - Trigger: "When a Teams webhook request is received"

3. **Flow 단계 설정**

   **Step 1: Trigger**
   ```
   When a Teams webhook request is received
   - Who can trigger the flow?: Anyone
   ```

   **Step 2: HTTP 요청 보내기**
   ```
   HTTP - HTTP 액션 추가
   - Method: POST
   - URI: https://your-app-name.onrender.com/teams/lunch
   - Body: triggerBody()
   - Headers: Content-Type: application/json
   ```

   **Step 3: Teams에 게시**
   ```
   Post card in a chat or channel
   - Post as: Flow bot
   - Post in: Channel
   - Team: 선택
   - Channel: 선택  
   - Adaptive Card: body('HTTP') (HTTP 응답 결과)
   ```

4. **Flow 저장 및 테스트**
   - "Save" 클릭
   - Webhook URL 복사

## 📱 **3단계: 사용법**

### 수동 트리거 (테스트용)

```bash
curl -X POST "YOUR_POWER_AUTOMATE_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"message": "점메추 요청"}'
```

### 자동화 옵션

1. **스케줄러 추가**
   - Power Automate에서 "Recurrence" 트리거 추가
   - 매일 점심시간 (12:00)에 자동 실행

2. **Teams 명령어 연동**
   - Power Apps에서 버튼 생성
   - Teams 탭으로 추가

3. **외부 시스템 연동**
   - Azure Logic Apps
   - GitHub Actions
   - Jenkins 등에서 Webhook 호출

## 🎯 **결과 확인**

Teams 채널에 다음과 같은 Adaptive Card가 표시됩니다:

```
🍔 오늘의 메뉴는?

[식당 이름]
[식당 주소]

[🗺️ 지도에서 보기] [📋 전체 리스트]
```

## 🔧 **고급 설정**

### 1. 보안 강화

Power Automate Flow에 조건 추가:
```
Condition: triggerOutputs()?['headers']['Authorization'] equals 'Bearer YOUR_SECRET'
```

### 2. 여러 채널 지원

HTTP 요청에 채널 정보 포함:
```json
{
  "channel": "general",
  "team": "개발팀"
}
```

### 3. 에러 처리

Flow에 "Try-Catch" 패턴 추가:
- HTTP 요청 실패 시 기본 메시지 표시
- 로깅 및 알림 설정

## 📋 **체크리스트**

- [ ] Render.com 배포 완료
- [ ] 환경 변수 설정 완료
- [ ] Power Automate Flow 생성
- [ ] Webhook URL 복사
- [ ] 테스트 실행 성공
- [ ] Teams 채널에 카드 표시 확인

## 🆘 **문제 해결**

### 문제: Flow가 트리거되지 않음
- Webhook URL이 올바른지 확인
- HTTP 요청 방식 확인 (POST)
- Content-Type 헤더 확인

### 문제: Adaptive Card가 표시되지 않음  
- 응답 형식이 올바른지 확인
- JSON 구조 검증
- Flow 실행 히스토리 확인

### 문제: 식당 정보가 나오지 않음
- `npm run fetch-menus` 실행
- NAVER_MAP_FOLDER_ID 환경 변수 확인
- 네이버 지도 폴더 공유 설정 확인 