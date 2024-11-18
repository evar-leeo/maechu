import { COMMON_ERROR_MSG } from "#core/constants/msg.contant.js";

export function handleGlobalError (error, _request, reply) {
  const message = error.statusCode === 429 ? COMMON_ERROR_MSG.RATE_LIMITED : error.message;
  reply.code(500)
  .header('Content-Type', 'application/json; charset=utf-8')
  .send({ status: message })
}
