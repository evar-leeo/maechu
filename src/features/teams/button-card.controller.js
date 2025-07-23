export async function createLunchButtonCard(request, reply) {
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
            text: "🍽️ 점심 메뉴 추천 봇",
            weight: "Bolder",
            size: "Large",
            color: "Accent",
            horizontalAlignment: "Center"
          },
          {
            type: "TextBlock", 
            text: "오늘 뭐 먹을지 고민된다면? 버튼을 눌러보세요!",
            wrap: true,
            horizontalAlignment: "Center",
            spacing: "Medium"
          },
          {
            type: "TextBlock",
            text: "🥘 제2판교 밥집 식권대장에서 랜덤 추천",
            wrap: true,
            size: "Small",
            color: "Attention",
            horizontalAlignment: "Center"
          }
        ],
        actions: [
          {
            type: "Action.Http",
            title: "🎲 점메추 해줘!",
            method: "POST",
            url: "https://maechu-v2-whmc.onrender.com/teams/lunch",
            body: JSON.stringify({
              source: "button_click",
              timestamp: new Date().toISOString()
            }),
            headers: {
              "Content-Type": "application/json"
            }
          }
        ]
      }
    }]
  };
} 