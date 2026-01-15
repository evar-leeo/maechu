
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
    const menuPath = join(__dirname, '../lunch_menu.json');
    const menuData = await readFile(menuPath, 'utf8');
    const menus = JSON.parse(menuData);

    if (!menus || menus.length === 0) {
      console.error('No menus found in lunch_menu.json');
      process.exit(1);
    }

    // 2. Select a random restaurant
    const randomIndex = Math.floor(Math.random() * menus.length);
    const selectedRestaurant = menus[randomIndex];

    console.log(`Selected Restaurant: ${selectedRestaurant.name}`);

    // 3. Construct payload for Teams
    // The structure depends on what the Power Automate flow expects. 
    // Usually a simple JSON object is enough for "When a HTTP request is received".
    // We send some basic details.
    const payload = {
      text: `🍽️ *오늘의 점심 추천* 🍽️\n\n**${selectedRestaurant.name}**\n📍 주소: ${selectedRestaurant.address || '주소 정보 없음'}\n🔗 [네이버 지도 보기](https://map.naver.com/v5/entry/place/${selectedRestaurant.sid})`,
      restaurant: {
        name: selectedRestaurant.name,
        address: selectedRestaurant.address,
        mapUrl: `https://map.naver.com/v5/entry/place/${selectedRestaurant.sid}`
      }
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
