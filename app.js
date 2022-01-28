import "@babel/polyfill";
import "cross-fetch/polyfill";
import Koa from 'koa';
import serverless from 'serverless-http';

const app = new Koa();

// response
app.use(async ctx => {
  const slackUrl = "https://hooks.slack.com/services/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";
  /*global fetch*/
  const resp = await fetch(slackUrl, {
    method: "POST",
    headers: {
        'Content-type': 'application/json'
    },
    body: JSON.stringify({"text":`Shutting down Windows machine... ${(new Date()).toISOString()}`})
  });
  console.log(await resp.text());
  ctx.body = {message: 'Hello Koa'};
});

app.listen(8080);

module.exports.handler = serverless(app);