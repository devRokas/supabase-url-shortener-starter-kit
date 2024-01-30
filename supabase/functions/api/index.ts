import { Router, Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { UrlShorteningService } from './services/urlShorteningService.ts';

const router = new Router()
const urlShorteningService = new UrlShorteningService();

router.post('/api/shorten', async (context) => {
  try {
    const body = await context.request.body().value;
    const urlToShorten = body.url;

    if (!urlToShorten) {
      context.response.status = 400;
      context.response.body = { message: "URL is required" };
      return;
    }

    const shortUrl = await urlShorteningService.shortenUrl(urlToShorten);
    
    context.response.status = 200;
    context.response.body = { shortUrl: shortUrl };
  } catch (error) {
    console.error('Error:', error);
    context.response.status = 500;
    context.response.body = { message: "Internal Server Error" };
  }
})

router.get('/api/:code', async (ctx) => {
  const code = ctx.params.code;
  const longUrl = await urlShorteningService.getLongUrl(code);

  if (!longUrl) {
      ctx.response.status = 404;
      ctx.response.body = 'Not Found';
      return;
  }
  
  ctx.response.redirect(longUrl);
});

const app = new Application()

app.use(
  oakCors({
    origin: "*", // This allows all origins. Adjust as needed for production.
  }),
);

app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 54321 })