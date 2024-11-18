import 'dotenv/config';

import maechu from "#core/maechu.js";
import { registerDoorayRoutes } from "#routes/dooray.routes.js";

const PORT = process.env.PORT || 4885;

maechu.get('/', () => {
  return { title: 'hello 😛', description: 'world 🌍'}
});

maechu.get('/awake', (_, reply) => {
  reply.code(200)
  .header('Content-Type', 'application/json; charset=utf-8')
  .send({ status: 'awaked' })
})

maechu.register(registerDoorayRoutes, { prefix: '/dooray' });

try {
  maechu.listen({ host: '0.0.0.0', port: PORT })
} catch (e) {
  maechu.log.error(e);
  process.exit(1);
}
