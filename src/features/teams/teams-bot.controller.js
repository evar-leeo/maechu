import dinningListService from "../lunch/services/dinning-list.service.js";

export async function handleTeamsBotMessage(request, reply) {
  const { type, text, from } = request.body;
  
  // 봇 메시지 처리
  if (type === 'message' && text) {
    const messageText = text.toLowerCase();
    
    // "점메추" 키워드 감지
    if (messageText.includes('점메추') || messageText.includes('메뉴') || messageText.includes('lunch')) {
      try {
        const lunchResponse = await dinningListService.getLunchMenu();
        
        if (!lunchResponse.attachments?.length) {
          return {
            type: "message",
            text: "죄송해요, 메뉴를 찾을 수 없어요 😅"
          };
        }

        const restaurant = lunchResponse.attachments[0];
        
        // Teams Bot용 응답 형식
        return {
          type: "message",
          attachments: [{
            contentType: "application/vnd.microsoft.card.adaptive",
                       content: {
             type: "AdaptiveCard", 
             version: "1.3",
             speak: `${from.name}님을 위한 오늘의 추천 메뉴는 ${restaurant.title}입니다. ${restaurant.text || '맛있는 식당입니다.'}`,
             body: [
                {
                  type: "TextBlock",
                  text: `🍽️ ${from.name}님을 위한 오늘의 메뉴!`,
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
        console.error('Bot message error:', error);
        return {
          type: "message",
          text: "죄송해요, 오류가 발생했어요. 잠시 후 다시 시도해주세요! 🙏"
        };
      }
    }
  }
  
  // 기본 응답
  return {
    type: "message", 
    text: "안녕하세요! 점메추를 원하시면 '점메추' 또는 '메뉴'라고 말씀해주세요! 🍽️"
  };
} 