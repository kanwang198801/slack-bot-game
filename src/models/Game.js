class Game {
   constructor() {
      this.guessCount = 0;
      this.gameOver = false;
      this.randomNumber = Math.floor(Math.random() * 10);
      this.response =
         'Welcome to the Slack Bot Game, try and guess what number I am thinking of between 0 and 10';
   }

   play(guess) {
      if (guess < this.randomNumber) {
         this.response = "The number I'm thinking of is lower.";
      } else if (guess > this.randomNumber) {
         this.response = "The number I'm thinking of is higher.";
      } else if (guess === this.randomNumber) {
         this.response =
            'Congratulations! You guessed the number I was thinking of!';
         this.gameOver = true;
      } else {
         this.response = 'Invalid input';
      }
      this.guessCount++;
      if (this.guessCount === 3) {
         this.gameOver = true;
      }
   }
}

module.exports = Game;
