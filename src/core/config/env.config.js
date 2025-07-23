import 'dotenv/config';

export const ENV_CONFIG = {
  // 서버 설정
  PORT: process.env.PORT || 4885,
  SERVER_URL: process.env.SERVER_URL || 'https://maechu-v2-whmc.onrender.com',
  
  // 네이버 지도 설정
  NAVER_MAP_FOLDER_ID: process.env.NAVER_MAP_FOLDER_ID || null,
  
  // Teams 설정
  TEAMS_BOT_ID: process.env.TEAMS_BOT_ID || 'lunch-recommend-bot-v2',
  TEAMS_APP_PACKAGE: process.env.TEAMS_APP_PACKAGE || 'com.maechu.lunchbot',
  
  // API 엔드포인트들
  get TEAMS_LUNCH_ENDPOINT() {
    return `${this.SERVER_URL}/teams/lunch`;
  },
  
  get TEAMS_BOT_ENDPOINT() {
    return `${this.SERVER_URL}/teams/bot/messages`;
  },
  
  get TEAMS_BUTTON_CARD_ENDPOINT() {
    return `${this.SERVER_URL}/teams/button-card`;
  },
  
  get TEAMS_HEALTH_ENDPOINT() {
    return `${this.SERVER_URL}/teams/health`;
  }
}; 