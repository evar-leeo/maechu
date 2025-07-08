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
  const {
    statusCode, body
  } = await request(`${NAVER_MAPS_BOOKMARK_API_URL}/${NAVER_MAP_FOLDER_ID}/bookmarks`);

  if (statusCode !== 200) throw new Error('네이버 지도에서 식권 정보를 불러오는데 실패하였습니다.');

  const json = await body.json();

  await writeFile(LUNCH_MENU_FILE_PATH, JSON.stringify(json, null, 2), 'utf8');
  console.log(`Lunch menu data saved to ${LUNCH_MENU_FILE_PATH}`);
}

fetchList().catch(console.error);
