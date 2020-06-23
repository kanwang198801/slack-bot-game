import Bot from './Bot';
import Game from './models/Game';

const store = require('data-store')({ path: process.cwd() + '/game.json' });
let games: Game[] = [];
const params = {
   icon_emoji: ':heart_eyes:',
};

const responseToUser = async (game: Game) => {
   const { response, gameOver, winner, player, channel } = game;
   // return message to user
   await Bot.postMessage(channel, response, params);
   if (gameOver) {
      store.del(player);
      games = games.filter((game) => game.player !== player);
      await Bot.postMessage('general', `Our winner is ${winner}`, params);
      await Bot.postMessage(channel, 'Game over!', params);
      // remove the game when it is over
   }
};

const initGame = async (player: string, channel: string) => {
   if (store.get(player)) {
      // continue an old game
      const {
         guessCount,
         gameOver,
         randomNumber,
         winner,
         response,
      } = store.get(player);
      const game = new Game(
         player,
         channel,
         guessCount,
         gameOver,
         randomNumber,
         winner,
         response
      );
      games.push(game);
      await Bot.postMessage(
         channel,
         `Continue the game, you can guess ${3 - guessCount} times`,
         params
      );
   } else {
      // start a new game
      const game = new Game(player, channel);
      games.push(game);
      await Bot.postMessage(
         channel,
         'Welcome to the Slack Bot Game, try and guess what number I am thinking of between 0 and 10! You can guess 3 times',
         params
      );
   }
};

Bot.on('message', function (data: any) {
   const { type, subtype, text, channel, user } = data;
   let foundGame = null;
   if (type !== 'message' || subtype === 'bot_message') return;
   if (games.length > 0) {
      foundGame = games.find((game) => game.player === user);
   }
   if (!foundGame && text !== 'botgame start') {
      return;
   }
   const player = user;
   if (!foundGame) {
      // init a game if it's not started
      initGame(player, channel);
      return;
   } else {
      const guess = parseInt(text);
      // play the game when get user's message
      foundGame.play(guess);
      responseToUser(foundGame);
      // set current game to local
      store.set(player, foundGame);
   }
});

Bot.on('error', function (err: string) {
   console.info(err);
});
