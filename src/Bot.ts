require('dotenv').config();
const SlackBot = require('slackbots');
const newBot = new SlackBot({
   token: process.env.SLACK_BOT_TOKEN,
   name: 'Bot Game',
});
export default newBot;
