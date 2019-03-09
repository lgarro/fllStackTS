/* eslint-disable no-console */

import Koa from 'koa';
import Router from 'koa-router';
import koaStatic from 'koa-static';
import path from 'path';
import send from 'koa-send';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from 'kcors';

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
const domain = process.env.DOMAIN || 'localhost';

const app = new Koa();

app
  .use(helmet())
  .use(cors())
  .use(bodyParser({ jsonLimit: '50mb' }));
app
  .use(async (ctx, next) => {
    try {
      console.log('Url:', ctx.url);
      await next();
    } catch (err) {
      ctx.status = err.statusCode || err.status || 500;
      console.error('error middleware top', {
        message: err.message,
        status: err.statusCode || err.status || 500
      });
      ctx.body = { message: err.message };
    }
  })
  .use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });
if (env === 'production') {
  // eslint-disable-next-line
  app.use(koaStatic('dist/public'));

  app.use(async (ctx, next) => {
    const isApiRequest =
      typeof ctx.headers.authorization !== 'undefined' ||
      ctx.path.includes('api'); //eslint-disable-line
    if (
      ctx.status === 404 &&
      ctx.method === 'GET' &&
      ctx.accepts('html') &&
      !isApiRequest
    ) {
      await send(ctx, path.join(__dirname, '/dist/public', 'index.html'));
    } else {
      await next();
    }
  });
}
/* app.use(
  jwt({ secret: process.env.APP_SECRET }).unless({
    path: [
      /^\/api\/auth/,
      /^\/api\/hello\/ts/,
      /^\/main\//,
      /^\/api\/unprotected/
    ]
  })
  // eslint-disable-next-line
); */
const router = new Router({ prefix: '/api' }).get('/hello/ts', async ctx => {
  ctx.body = 'This is my first typescript boilerplate';
});
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.info(`Server listening in port ${port}`);
});
