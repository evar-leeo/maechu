import 'dotenv/config';

export const ENV_CONFIG = {
  // 서버 설정
  PORT: parseInt(process.env.PORT) || 8080,
  SERVER_URL: process.env.SERVER_URL || `http://localhost:${parseInt(process.env.PORT) || 8080}`,
  
  // 네이버 지도 설정
  NAVER_MAP_FOLDER_ID: process.env.NAVER_MAP_FOLDER_ID,
}; 