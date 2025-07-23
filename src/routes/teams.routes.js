import { handleTeamsLunchRequest } from "#features/teams/teams.controller.js";
import { createLunchButtonCard } from "#features/teams/button-card.controller.js";
import dinningListService from "#features/lunch/services/dinning-list.service.js";

export async function registerTeamsRoutes(maechu) {
  dinningListService.initialize();

  // Power Automate Workflows용 엔드포인트
  maechu.post('/lunch', handleTeamsLunchRequest);
  maechu.get('/lunch', handleTeamsLunchRequest); // GET 요청도 지원

  // 점메추 버튼 카드 생성 (Teams 채널에 고정용)
  maechu.get('/button-card', createLunchButtonCard);

  // 헬스체크 엔드포인트
  maechu.get('/health', () => {
    return { status: 'healthy', service: 'teams-lunch-bot' };
  });
} 