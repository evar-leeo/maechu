import dinningListService from "#features/lunch/services/dinning-list.service.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerWebRoutes(maechu) {
  // 메인 웹페이지
  maechu.get('/web', async (request, reply) => {
    return reply.sendFile('index.html');
  });

  // 웹용 점심 메뉴 API (JSON 응답)
  maechu.get('/api/lunch', async (request, reply) => {
    try {
      await dinningListService.initialize();
      const lunchResponse = await dinningListService.getLunchMenu();
      
      if (!lunchResponse.attachments?.length) {
        return {
          success: false,
          message: "메뉴를 뽑는데 실패했어요 🫠",
          restaurant: null
        };
      }

      const restaurant = lunchResponse.attachments[0];
      
      return {
        success: true,
        message: "오늘의 메뉴를 추천했습니다!",
        restaurant: {
          name: restaurant.title?.replace(' (클릭)', '') || '알 수 없는 식당',
          address: restaurant.text || '주소 정보 없음',
          mapUrl: restaurant.titleLink || '#',
          listUrl: restaurant.authorLink || '#',
          folderName: restaurant.authorName?.replace(' (전체 리스트)', '') || '맛집 리스트'
        }
      };
      
    } catch (error) {
      console.error('Web lunch API error:', error);
      return {
        success: false,
        message: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        restaurant: null
      };
    }
  });

  // 식당 목록 API
  maechu.get('/api/restaurants', async (request, reply) => {
    try {
      await dinningListService.initialize();
      
      const statusSummary = dinningListService.getRestaurantStatusSummary();
      const restaurants = dinningListService.bookmarkList || [];
      
      // 영업 상태별로 분류
      const availableRestaurants = restaurants.filter(r => dinningListService.isRestaurantAvailable(r));
      const unavailableRestaurants = restaurants.filter(r => !dinningListService.isRestaurantAvailable(r));
      
      return {
        success: true,
        restaurants: restaurants.map(restaurant => ({
          ...restaurant,
          isAvailable: dinningListService.isRestaurantAvailable(restaurant)
        })),
        availableRestaurants,
        unavailableRestaurants,
        statusSummary,
        folder: dinningListService.folder || null
      };
      
    } catch (error) {
      console.error('Restaurants API error:', error);
      return {
        success: false,
        message: "식당 목록을 불러오는데 실패했습니다.",
        restaurants: [],
        statusSummary: null,
        folder: null
      };
    }
  });
} 