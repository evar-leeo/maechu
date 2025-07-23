import { readFileSync, statSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { request } from 'undici';
import { NAVER_MAPS_BOOKMARK_WEB_URL, NAVER_MAPS_BOOKMARK_API_URL } from '../constants/naver-url.constants.js';
import { ENV_CONFIG } from '../../../core/config/env.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const lunchMenuPath = path.resolve(__dirname, '../constants/lunch_menu.json');

let lunchMenuData = null;
let lastFileModified = 0;
let isInitialized = false;

function loadMenuDataIfNeeded() {
  try {
    const stats = statSync(lunchMenuPath);
    const fileModified = stats.mtime.getTime();
    
    // 파일이 변경되었으면 다시 로드
    if (fileModified > lastFileModified) {
      lunchMenuData = JSON.parse(readFileSync(lunchMenuPath, 'utf8'));
      lastFileModified = fileModified;
      console.log('🍽️ 메뉴 데이터 업데이트됨:', new Date(fileModified).toLocaleString());
    }
  } catch (error) {
    console.warn('lunch_menu.json 로드 실패:', error.message);
    lunchMenuData = null;
  }
}

async function fetchLatestMenuData() {
  const NAVER_MAP_FOLDER_ID = ENV_CONFIG.NAVER_MAP_FOLDER_ID;
  
  if (!NAVER_MAP_FOLDER_ID) {
    console.warn('⚠️ NAVER_MAP_FOLDER_ID가 설정되지 않아 메뉴 자동 갱신을 건너뜁니다.');
    return false;
  }

  try {
    console.log('🔄 최신 메뉴 데이터 가져오는 중...');
    
    const { statusCode, body } = await request(`${NAVER_MAPS_BOOKMARK_API_URL}/${NAVER_MAP_FOLDER_ID}/bookmarks`);

    if (statusCode !== 200) {
      throw new Error(`네이버 지도 API 응답 오류: ${statusCode}`);
    }

    const json = await body.json();
    
    // 파일에 저장
    writeFileSync(lunchMenuPath, JSON.stringify(json, null, 2), 'utf8');
    console.log('✅ 최신 메뉴 데이터 저장 완료');
    
    // 메모리에도 로드
    lunchMenuData = json;
    lastFileModified = Date.now();
    
    return true;
  } catch (error) {
    console.error('❌ 메뉴 데이터 갱신 실패:', error.message);
    console.log('📁 기존 파일 데이터를 사용합니다.');
    return false;
  }
}

// 초기 로드 및 갱신
async function initializeMenuData() {
  if (isInitialized) return;
  
  console.log('🚀 메뉴 데이터 초기화 중...');
  
  // 1. 먼저 최신 데이터 가져오기 시도
  const fetchSuccess = await fetchLatestMenuData();
  
  // 2. 실패했거나 추가 보완을 위해 기존 파일도 로드
  if (!fetchSuccess || !lunchMenuData) {
    loadMenuDataIfNeeded();
  }
  
  isInitialized = true;
  
  if (lunchMenuData) {
    const restaurantCount = lunchMenuData.bookmarkList?.length || 0;
    console.log(`🍽️ 메뉴 데이터 준비 완료: ${restaurantCount}개 식당`);
  } else {
    console.warn('⚠️ 메뉴 데이터를 불러올 수 없습니다.');
  }
}

// 서버 시작 시 초기화 실행
initializeMenuData();

class DinningList {
  folder = null;
  bookmarkList = [];

  lastUpdated = Date.now();

  async initialize() {
    // 초기화가 완료될 때까지 대기
    if (!isInitialized) {
      await initializeMenuData();
    }
    
    if (!this.bookmarkList.length) {
      await this.updateList();
    }
  }

  async updateList() {
    // 파일 변경 체크 후 필요시 다시 로드
    loadMenuDataIfNeeded();
    
    if (!lunchMenuData) throw new Error('메뉴 데이터를 사용할 수 없습니다. 네이버 지도 설정을 확인해주세요.');

    const { folder, bookmarkList } = lunchMenuData;

    this.folder = folder;
    this.bookmarkList = bookmarkList;
    this.lastupdate = Date.now();
  }

  async getRandomMenu(updateCount = 0) {
    const len = this.bookmarkList?.length;
    if (!len) throw new Error('등록된 메뉴 정보가 없습니다.');

    const randomIdx = Math.trunc(Math.random() * len);
    const menu = this.bookmarkList[randomIdx];

    if (!menu.available) {
      if (updateCount < 3) return this.getRandomMenu(updateCount + 1);
      return null;
    }

    return menu;
  }

  async getLunchMenu() {

    const baseResponse = { responseType: 'inChannel' };

    getLunch: {
      const menu = await this.getRandomMenu();

      if (!menu) {
        baseResponse.text = '메뉴를 뽑는데 실패 했어요. 네이버 지도 리스트를 확인 해 주세요'
        if (this.folder) {
          baseResponse.attachments = [
            {
              title: this.folder.name,
              titleLink: `${NAVER_MAPS_BOOKMARK_WEB_URL}/${this.folder.shareId}`
            }
          ]
        }
        break getLunch;
      }

      baseResponse.attachments = [
        {
          title: `${menu.name} (클릭)`,
          titleLink: `https://map.naver.com/p/entry/place/${menu.sid}?placePath=/menu`,
          text: menu.address || menu.name,
          authorName: `${this.folder.name} (전체 리스트)`,
          authorLink: `https://map.naver.com/p/favorite/myPlace/folder/${this.folder.shareId}`
        }
      ]
    }

    return baseResponse;
  }
}

export default new DinningList();
