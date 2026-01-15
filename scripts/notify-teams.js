
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Teams Webhook URL (Power Automate)
const WEBHOOK_URL = 'https://default66a97319b9a4475d9ecbe417e03e9e.e2.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/3f8aaa5e0c834d7dbe22c8014b478d45/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=I5vJ6bZ1fm_VBXvllsCD7bKUbwnU4Lgr4naKcYSGI6Y';

async function main() {
  try {
    // 1. Read lunch_menu.json
    const menuPath = join(__dirname, '../src/features/lunch/constants/lunch_menu.json');
    const menuData = await readFile(menuPath, 'utf8');
    const parsedData = JSON.parse(menuData);
    const menus = parsedData.bookmarkList || [];

    if (!menus || menus.length === 0) {
      console.error('No menus found in lunch_menu.json');
      process.exit(1);
    }

    // 2. Select 3 unique random restaurants
    const selectedRestaurants = [];
    const tempMenus = [...menus]; // Copy to avoid modifying original array

    // Pick up to 3 restaurants, or fewer if not enough data
    const count = Math.min(3, tempMenus.length);
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * tempMenus.length);
        selectedRestaurants.push(tempMenus[randomIndex]);
        tempMenus.splice(randomIndex, 1); // Remove selected to ensure uniqueness
    }

    console.log(`Selected Restaurants: ${selectedRestaurants.map(r => r.name).join(', ')}`);

    // 3. Construct payload for Teams (Adaptive Card)
    
    // Create restaurant items for the card
    const restaurantItems = selectedRestaurants.map((restaurant, index) => {
        return {
            type: "Container",
            separator: index > 0, // Add separator for 2nd and 3rd items
            spacing: "Medium",
            items: [
                {
                    type: "TextBlock",
                    text: `${index + 1}. ${restaurant.name}`,
                    wrap: true,
                    size: "Large",
                    weight: "Bolder",
                    color: "Accent"
                },
                {
                    type: "TextBlock",
                    text: restaurant.address || "주소 정보 없음",
                    wrap: true,
                    spacing: "None",
                    size: "Small",
                    isSubtle: true
                },
                {
                    type: "ActionSet",
                    actions: [
                        {
                            type: "Action.OpenUrl",
                            title: "네이버 지도 보기",
                            url: `https://map.naver.com/v5/entry/place/${restaurant.sid}`
                        }
                    ]
                }
            ]
        };
    });

    const payload = {
      type: "message",
      attachments: [
        {
          contentType: "application/vnd.microsoft.card.adaptive",
          content: {
            $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
            type: "AdaptiveCard",
            version: "1.4",
            body: [
              {
                type: "TextBlock",
                size: "Medium",
                weight: "Bolder",
                text: "🍽️ 오늘의 점심 추천 (3곳)"
              },
              ...restaurantItems
            ]
          }
        }
      ]
    };

    // 4. Send request
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send notification: ${response.status} ${response.statusText}\n${errorText}`);
    }

    console.log('✅ Notification sent successfully to Teams!');

  } catch (error) {
    console.error('❌ Error sending notification:', error);
    process.exit(1);
  }
}

main();
