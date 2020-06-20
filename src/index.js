const Bot = require('./Bot');
const Game = require('./models/Game');
// let disconnect = false;

const game = new Game();

const responseToUser = async (game) => {
   var params = {
      icon_emoji: ':heart_eyes:',
   };
   await Bot.postMessageToChannel('general', game.response, params);
   if (game.gameOver) {
      //   disconnect = true;
      await Bot.postMessageToChannel('general', 'Game over!', params);
   }
};

Bot.on('start', function () {
   responseToUser(game);
});

Bot.on('message', function (data) {
   if (data.type !== 'message' || data.subtype === 'bot_message') {
      return;
   }
   const guess = parseInt(data.text);
   game.play(guess);
   responseToUser(game);
});

Bot.on('error', function (err) {
   console.info(err);
});
