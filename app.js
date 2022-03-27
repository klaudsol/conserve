import 'dotenv/config';
import "@babel/polyfill";
import "cross-fetch/polyfill";
import Koa from 'koa';
import serverless from 'serverless-http';
import { EC2 } from '@aws-sdk/client-ec2';

const app = new Koa();

// response
app.use(async ctx => {
  const ec2 = new EC2({region: 'us-east-1', maxRetries: 15});
   var params = {
    InstanceIds: [
       "i-055e44a095b21d5bf"
    ]
   };
  const result = await ec2.describeInstances(params);
  /*
   ec2.describeInstances(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
     /*
     data = {
     }
   });
     */
  console.log(result.Reservations.map(x => x.Instances[0].State.Name));
  const slackUrl = process.env.SLACK_URL;
  console.log(`SLACKURL: ${slackUrl}`);
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