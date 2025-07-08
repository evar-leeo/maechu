import { request } from "undici";
import { NAVER_MAP_FOLDER_ID, NAVER_MAPS_BOOKMARK_API_URL } from "../constants/naver-url.constants.js";
import lunch_menus from '../constants/lunch_menu.json';
class DinningList {
  folder = null;
  bookmarkList = [];

  lastUpdated = Date.now();

  initialize() {
    if (!this.bookmarkList.length) void this.updateList();
  }

  async updateList() {
    if (!lunch_menus) throw new Error('scripts/fetch-menu를 실행하여 메뉴를 먼저 받아와 주세요');

    const { folder, bookmarkList } = lunch_menus;

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
