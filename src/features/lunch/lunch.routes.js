import { handleGetSimpleLunch } from "./controller/simple-lunch.controller.js";
import dinningListService from "./services/dinning-list.service.js";

export async function registerLunchRoutes(maechu) {
  dinningListService.initialize();

  maechu.post('/simple', handleGetSimpleLunch);
  maechu.get('/simple', handleGetSimpleLunch); // GET 요청도 지원

}
