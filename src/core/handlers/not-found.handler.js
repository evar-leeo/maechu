import { COMMON_ERROR_MSG } from "#core/constants/msg.contant.js";

export function handleNotFound (_request, reply) {
  reply.code(404)
  .header('Content-Type', 'application/json; charset=utf-8')
  .send({ status: COMMON_ERROR_MSG.NOT_FOUND })
}
