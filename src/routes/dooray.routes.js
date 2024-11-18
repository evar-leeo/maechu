import { COMMON_ERROR_MSG } from "#core/constants/msg.contant.js";
import { bindUserId } from "#core/hooks/bind-userid.hook.js";
import * as doorayController from "#features/dooray/dooray.controller.js";
import { registerLunchRoutes } from "#features/lunch/lunch.routes.js";

export async function registerDoorayRoutes(maechu) {

  maechu.decorateRequest('channelId', '');
  maechu.addHook('preHandler', bindUserId);

  maechu.register(registerLunchRoutes, { prefix: '/lunch' });
  maechu.post('/callbacks', doorayController.handleDoorayCallbacks);

  maechu.setErrorHandler(doorayController.handleDoorayError);

}
