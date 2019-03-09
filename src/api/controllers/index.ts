import Router from 'koa-router';
const router = new Router({ prefix: '/api' }).get('/hello/ts', async ctx => {
  ctx.body = 'This is my first typescript boilerplate';
});

export default router;
