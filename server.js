import 'dotenv/config';

import maechu from "#core/maechu.js";
import { registerWebRoutes } from "#routes/web.routes.js";
import { ENV_CONFIG } from "#core/config/env.config.js";

const PORT = ENV_CONFIG.PORT;

maechu.get('/', () => {
  return { 
    title: 'hello 😛', 
    description: 'world 🌍',
    server_url: ENV_CONFIG.SERVER_URL,
    web_url: `${ENV_CONFIG.SERVER_URL}/web`
  }
});

maechu.get('/awake', (_, reply) => {
  reply.code(200)
  .header('Content-Type', 'application/json; charset=utf-8')
  .send({ status: 'awaked' })
})

maechu.register(registerWebRoutes);

try {
  await maechu.listen({ host: '0.0.0.0', port: PORT });
  
  console.log(`🚀 Server running at: ${ENV_CONFIG.SERVER_URL}`);
  console.log(`🌐 Web interface: ${ENV_CONFIG.SERVER_URL}/web`);
  
} catch (e) {
  maechu.log.error(e);
  process.exit(1);
}
