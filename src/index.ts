import Bot from './Bot';
import Game from './models/Game';
const store = require('data-store')({ path: process.cwd() + '/game.json' });
let game: Game;

if (store.get('Game')) {
   const { guessCount, gameOver, randomNumber, winner, response } = store.get(
      'Game'
   );
   game = new Game(guessCount, gameOver, randomNumber, winner, response);
} else {
   game = new Game();
}

const responseToUser = async (g: Game) => {
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
   responseToUser(game);
});

Bot.on('message', function (data: any) {
   if (data.type !== 'message' || data.subtype === 'bot_message') {
      return;
   }
   const guess = parseInt(data.text);
   // play the game when get user's message
   game.play(guess);
   responseToUser(game);

   // set current game to local
   store.set('Game', game);
   console.log();
});

Bot.on('error', function (err: string) {
   // catch the error message
   console.info(err);
});
