import { SIMPLE_LUNCH_ACTION, SIMPLE_LUNCH_BUTTONS } from "../constants/actions.constants.js";
import dinningListService from "../services/dinning-list.service.js";
import lunchIconsService from "../services/lunch-icons.service.js";
import voteManagerService from "../services/vote-manager.service.js";


export async function handleGetSimpleLunch (channelId) {
  if (voteManagerService.hasVoteStatus(channelId)) {
    return {
      text: '이미 추천이 진행중이에요. 기존 점메추를 완료해 주세요 🤷‍♂️',
      replaceOriginal: false,
      responseType: "ephemeral"
    }
  }

  const lunchResponse = await dinningListService.getLunchMenu();

  if (!lunchResponse.attachments?.length || !lunchResponse.attachments[0].authorName) {
    voteManagerService.removeVoteStatus(channelId);
    return lunchResponse;
  }

  lunchResponse.text = '오늘의 메뉴는 ? 😋';
  lunchResponse.attachments.push(SIMPLE_LUNCH_ACTION);

  voteManagerService.cacheVoteStatus(channelId, lunchResponse);

  return lunchResponse;
}


export async function handleSimpleLunchResponse(channelId, body) {
  switch (body.actionValue) {
    case SIMPLE_LUNCH_BUTTONS.RETRY:
      return await retryLunchMenu(channelId, body);
    case SIMPLE_LUNCH_BUTTONS.CONFIRM:
      return await confirmLunchMenu(channelId, body);
    case SIMPLE_LUNCH_BUTTONS.CANCEL:
      return await cancelLunchMenu(channelId, body);
    default:
      throw new Error('알 수 없는 응답');
  }
}


async function retryLunchMenu(channelId, message) {
  const lunchResponse = await dinningListService.getLunchMenu();
  lunchResponse.replaceOriginal = true;

  if (!lunchResponse.attachments?.length || !lunchResponse.attachments[0].authorName) {
    voteManagerService.removeVoteStatus(channelId);
    return lunchResponse;
  }

  const userTag = `(dooray://${message.tenant.id}/members/${message.user.id} "member")`
  lunchResponse.text = `${userTag} 님이 싫다고 해서 다시 뽑았어요 🙂`;
  lunchResponse.attachments.push(SIMPLE_LUNCH_ACTION);

  voteManagerService.cacheVoteStatus(channelId, lunchResponse);

  return lunchResponse;
}

async function confirmLunchMenu(channelId, message) {
  const userTag = `(dooray://${message.tenant.id}/members/${message.user.id} "member")`
  const response = {
    text: `🎉 ${userTag} 님이 메뉴를 확정했어요 🎉`,
    responseType: 'inChannel',
    deleteOriginal: true,
    attachments: message.originalMessage.attachments.slice(0,1)
  }
  voteManagerService.removeVoteStatus(channelId);
  return response;
}

async function cancelLunchMenu(channelId, _message) {
  const randomIcon = lunchIconsService.getRandomLunchIcon();
  const response = {
    responseType: 'inChannel',
    text: `🫨..${randomIcon}?`,
    deleteOriginal: true,
  }
  voteManagerService.removeVoteStatus(channelId);
  return response;
}
