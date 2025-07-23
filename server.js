import 'dotenv/config';

import maechu from "#core/maechu.js";
import { registerDoorayRoutes } from "#routes/dooray.routes.js";
import { registerTeamsRoutes } from "#routes/teams.routes.js";
import { ENV_CONFIG } from "#core/config/env.config.js";
import { generateTeamsManifest, getApiEndpoints } from "#core/utils/manifest-generator.js";

const PORT = ENV_CONFIG.PORT;

maechu.get('/', () => {
  const endpoints = getApiEndpoints();
  return { 
    title: 'hello 😛', 
    description: 'world 🌍',
    server_url: ENV_CONFIG.SERVER_URL,
    endpoints
  }
});

maechu.get('/awake', (_, reply) => {
  reply.code(200)
  .header('Content-Type', 'application/json; charset=utf-8')
  .send({ status: 'awaked' })
})

maechu.register(registerDoorayRoutes, { prefix: '/dooray' });
maechu.register(registerTeamsRoutes, { prefix: '/teams' });

try {
  // Teams 매니페스트 생성
  try {
    generateTeamsManifest();
  } catch (manifestError) {
    maechu.log.warn('Failed to generate Teams manifest:', manifestError.message);
  }
  
  await maechu.listen({ host: '0.0.0.0', port: PORT });
  
  console.log(`🚀 Server running at: ${ENV_CONFIG.SERVER_URL}`);
  console.log(`📱 Teams endpoints: ${JSON.stringify(getApiEndpoints(), null, 2)}`);
  
} catch (e) {
  maechu.log.error(e);
  process.exit(1);
}
