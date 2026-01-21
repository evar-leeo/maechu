import 'dotenv/config';
import { request } from "undici";
import { writeFile } from "fs/promises";
import { NAVER_MAPS_BOOKMARK_API_URL } from "../src/features/lunch/constants/naver-url.constants.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NAVER_MAP_FOLDER_ID = process.env.NAVER_MAP_FOLDER_ID || null;
const LUNCH_MENU_FILE_PATH = path.resolve(__dirname, "../src/features/lunch/constants/lunch_menu.json");

async function fetchList() {
  if (!NAVER_MAP_FOLDER_ID) throw new Error('네이버 지도 저장 리스트 아이디를 설정해 주세요');
  
  // 올바른 네이버 API 파라미터 사용
  const apiUrl = `${NAVER_MAPS_BOOKMARK_API_URL}/${NAVER_MAP_FOLDER_ID}/bookmarks?start=0&limit=5000&sort=lastUseTime&createIdNo=false`;
  console.log(`🔄 API 호출: ${apiUrl}`);
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://map.naver.com/',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    'Origin': 'https://map.naver.com'
  };

  const { statusCode, body } = await request(apiUrl, { headers });

  if (statusCode !== 200) throw new Error('네이버 지도에서 식권 정보를 불러오는데 실패하였습니다.');

  const json = await body.json();
  
  console.log(`📊 수집 완료: ${json.bookmarkList?.length || 0}개 식당 (총 ${json.folder?.bookmarkCount || 0}개 중)`);

  await writeFile(LUNCH_MENU_FILE_PATH, JSON.stringify(json, null, 2), 'utf8');
  console.log(`✅ Lunch menu data saved to ${LUNCH_MENU_FILE_PATH}`);
}

fetchList().catch(console.error);
