const Bot = require('./Bot');
const Game = require('./models/Game');
let game;

const responseToUser = async (g) => {
   var params = {
      icon_emoji: ':heart_eyes:',
   };
   // return message to users
   await Bot.postMessageToChannel('general', g.response, params);
   if (g.gameOver) {
      await Bot.postMessageToChannel(
         'general',
         `Our winner is ${g.winner}`,
         params
      );
      await Bot.postMessageToChannel('general', 'Game over!', params);
      // start a new game
      game = new Game();
      responseToUser(game);
   }
};

Bot.on('start', function () {
   // start a game in when the app start
   game = new Game();
   responseToUser(game);
});

Bot.on('message', function (data) {
   if (data.type !== 'message' || data.subtype === 'bot_message') {
      return;
   }
   console.info('data!!!!!!:', data);
   const guess = parseInt(data.text);
   // play the game when get user's message
   game.play(guess, data.user);
   responseToUser(game);
});

Bot.on('error', function (err) {
   // catch the error message
   console.info(err);
});
