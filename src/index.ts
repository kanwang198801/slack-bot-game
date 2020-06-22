import Bot from './Bot';
import Game from './models/Game';

const store = require('data-store')({ path: process.cwd() + '/game.json' });
let game: Game;
let currentUser: string;
const params = {
   icon_emoji: ':heart_eyes:',
};

const responseToUser = async () => {
   const { response, gameOver, winner } = game;
   // return message to user
   await Bot.postMessageToChannel('general', response, params);
   if (gameOver) {
      await Bot.postMessageToChannel(
         'general',
         `Our winner is ${winner}`,
         params
      );
      await Bot.postMessageToChannel('general', 'Game over!', params);
      console.info('currentUser', currentUser);
      store.del(currentUser);
      initGame();
   }
};

const initGame = async () => {
   if (store.get(currentUser)) {
      // continue an old game
      const {
         guessCount,
         gameOver,
         randomNumber,
         winner,
         response,
      } = store.get(currentUser).game;
      game = new Game(guessCount, gameOver, randomNumber, winner, response);
   } else {
      // start a new game
      game = new Game();
      await Bot.postMessageToChannel('general', game.response, params);
   }
};

Bot.on('message', function (data: any) {
   const { type, subtype } = data;
   if (type !== 'message' || subtype === 'bot_message') {
      return;
   }
   const { user, text } = data;
   const guess = parseInt(text);
   currentUser = user;
   // init game
   if (!game) {
      initGame();
   }
   // play the game when get user's message
   game.play(guess);
   responseToUser();
   // set current game to local
   store.set(data.user, { game: game });
});

Bot.on('error', function (err: string) {
   console.info(err);
});
