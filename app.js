import 'dotenv/config';
import "@babel/polyfill";
import "cross-fetch/polyfill";
import Koa from 'koa';
import serverless from 'serverless-http';
import { EC2 } from '@aws-sdk/client-ec2';

const app = new Koa();

// response


const slackMessage = (message) => {
  const slackUrl = process.env.SLACK_URL;
  /*global fetch*/
  fetch(slackUrl, {
    method: "POST",
    headers: {
        'Content-type': 'application/json'
    },
    body: JSON.stringify({"text": message})
  });
}; 

app.use(async ctx => {
  const instances = JSON.parse(process.env.INSTANCES || "[]");
  
  instances.map(async (instance) => {
    slackMessage(`Shutting down ${instance.id} in ${instance.region}...`);
    const ec2 = new EC2({region: instance.region, maxRetries: 15});
    const result = await ec2.stopInstances({InstanceIds: [instance.id]});
    console.log(result);
  });
  await Promise.all(instances);
  
  ctx.body = {message: 'OK'};
});

app.listen(8080);

module.exports.handler = serverless(app);