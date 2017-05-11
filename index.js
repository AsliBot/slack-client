const Botkit = require('botkit');
const axios = require('axios');
const ENV = process.env.NODE_ENV || "development";
const config = require('./config')[ENV];

const controller = Botkit.slackbot({ debug: false });

controller.spawn({
  token: config.token
}).startRTM((err, bot, payload) => {
  if (err) throw new Error('Error connecting to slack: ', err);
  console.log('Connected to Slack');
});

controller.hears('', ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
  axios.get( `${config.asliBot}?q=${message.text}&platform=slack&user=${message.user}` )
    .then( res => {
      const response = res.data;
      if(response.error) {
        bot.reply(message, "Sorry, please try again!");
      } else {
        bot.reply(message, response.data);
      }
    })
    .catch( err => {
      bot.reply(message, "Sorry, please try again!");
    });

});
