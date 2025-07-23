import dinningListService from "../lunch/services/dinning-list.service.js";
import lunchIconsService from "../lunch/services/lunch-icons.service.js";

export async function handleTeamsLunchRequest(request, reply) {
  try {
    const lunchResponse = await dinningListService.getLunchMenu();
    
    if (!lunchResponse.attachments?.length) {
      return {
        type: "message",
        attachments: [{
          contentType: "application/vnd.microsoft.card.adaptive",
          content: {
            type: "AdaptiveCard",
            version: "1.3",
            body: [{
              type: "TextBlock",
              text: "메뉴를 뽑는데 실패했어요 🫠",
              wrap: true,
              size: "Medium"
            }]
          }
        }]
      };
    }

    const restaurant = lunchResponse.attachments[0];
    const randomIcon = lunchIconsService.getRandomLunchIcon();
    
    return {
      type: "message",
      attachments: [{
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          type: "AdaptiveCard",
          version: "1.3",
          body: [
            {
              type: "TextBlock",
              text: `오늘의 메뉴는? ${randomIcon}`,
              weight: "Bolder",
              size: "Large",
              color: "Accent"
            },
            {
              type: "TextBlock",
              text: restaurant.title,
              weight: "Bolder",
              size: "Medium",
              spacing: "Medium"
            },
            {
              type: "TextBlock",
              text: restaurant.text || "맛있는 식당입니다!",
              wrap: true,
              spacing: "Small"
            }
          ],
          actions: [
            {
              type: "Action.OpenUrl",
              title: "🗺️ 지도에서 보기",
              url: restaurant.titleLink
            },
            {
              type: "Action.OpenUrl", 
              title: "📋 전체 리스트",
              url: restaurant.authorLink
            }
          ]
        }
      }]
    };
    
  } catch (error) {
    console.error('Teams lunch request error:', error);
    return {
      type: "message",
      attachments: [{
        contentType: "application/vnd.microsoft.card.adaptive", 
        content: {
          type: "AdaptiveCard",
          version: "1.3",
          body: [{
            type: "TextBlock",
            text: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
            wrap: true
          }]
        }
      }]
    };
  }
} 