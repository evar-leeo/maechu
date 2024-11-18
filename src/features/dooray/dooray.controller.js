import { LUNCH_CALLBACKS } from "#features/lunch/constants/actions.constants.js";
import { handleSimpleLunchResponse } from "#features/lunch/controller/simple-lunch.controller.js";

export async function handleDoorayCallbacks (request) {
  const { body, channelId } = request
  if (!body) throw new Error('no body exposed');

  switch (body.callbackId) {
    case LUNCH_CALLBACKS.RESPONSE_SIMPLE_LUNCH:
      return await handleSimpleLunchResponse(channelId, body);
    default:
      throw new Error('알 수 없는 액션');
  }
}

export function handleDoorayError (error, _request, reply) {
  const errorMessage = {
    responseType: "inChannel",
    replaceOriginal: true,
    text: error.statusCode === 429 ? COMMON_ERROR_MSG.RATE_LIMITED : error.message
  }

  void reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(errorMessage)
}
