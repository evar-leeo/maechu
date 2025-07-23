import { readFileSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { NAVER_MAPS_BOOKMARK_WEB_URL } from '../constants/naver-url.constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const lunchMenuPath = path.resolve(__dirname, '../constants/lunch_menu.json');

let lunchMenuData = null;
let lastFileModified = 0;

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

// 초기 로드
loadMenuDataIfNeeded();

class DinningList {
  folder = null;
  bookmarkList = [];

  lastUpdated = Date.now();

  initialize() {
    if (!this.bookmarkList.length) void this.updateList();
  }

  async updateList() {
    // 파일 변경 체크 후 필요시 다시 로드
    loadMenuDataIfNeeded();
    
    if (!lunchMenuData) throw new Error('scripts/fetch-menu를 실행하여 메뉴를 먼저 받아와 주세요');

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
