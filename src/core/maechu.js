import Fastify from "fastify";
import RateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";

import { getTenantId } from "./hooks/get-tenantid.hook.js";
import { ignoreCronLogs } from "./hooks/ignore-cron-logs.hook.js";
import { handleNotFound } from "./handlers/not-found.handler.js";
import { handleGlobalError } from "./handlers/global-error.handler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const maechu = Fastify({
  trustProxy: true,
  logger: {
    level: 'info',
    redact: {
      paths: ['reqId', 'level', 'pid', 'hostname'],
      remove: true
    }
  }
});

// 정적 파일 서빙 설정
await maechu.register(fastifyStatic, {
  root: path.join(__dirname, '../../public'),
  prefix: '/public/',
});

await maechu.register(RateLimit, {
  hook: 'preHandler',
  max: 61,
  timeWindow: '1 minute',
  keyGenerator: getTenantId
});

maechu.addHook('onRoute', ignoreCronLogs);

maechu.setNotFoundHandler({
  preHandler: maechu.rateLimit({
    max: 4,
    timeWindow: 1e3
  })
}, handleNotFound)
maechu.setErrorHandler(handleGlobalError);

export default maechu;
