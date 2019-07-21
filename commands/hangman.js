// const Discord = require('discord.js');
// module.exports = {
// 	name: 'hangman',
// 	description: 'It is a game duh.',
// 	// eslint-disable-next-line no-unused-vars
// 	execute(message, args) {
//
// 		function isWordGuessed(secretWord, lettersGuessed) {
//
// 			// secretWord: the word the user is guessing.
// 			// lettersGuessed: what letters have been guessed so far.
// 			// returns True if all the letters of secretWord are in lettersGuessed.
//
// 			// eslint-disable-next-line no-var
// 			var i;
// 			for (i in secretWord) {
// 				if (!lettersGuessed.includes(i)) {
// 					return false;
// 				}
// 			}
// 			return true;
// 		}
//
// 		function getGuessedWord(secretWord, lettersGuessed) {
//
// 			// lettersGuessed: list, what letters have been guessed so far
// 			// returns: string, comprised of letters and underscores that represents
// 			//   what letters in secretWord have been guessed so far.
//
// 			// eslint-disable-next-line no-var
// 			var result = [];
// 			// eslint-disable-next-line no-var
// 			var m;
// 			for (m in secretWord) {
// 				if (lettersGuessed.includes(m)) {
// 					result.push(m);
// 				}
// 				else {
// 					result.push('_');
// 				}
// 			}
// 			return ' '.join(result);
// 		}
//
// 		function getAvailableLetters(lettersGuessed) {
//
// 			// lettersGuessed: list, what letters have been guessed so far
// 			// returns: string, comprised of letters that represents what letters have not
// 			//   yet been guessed.
//
// 			const alph = 'abcdefghijklmnopqrstuvwxyz';
// 			// eslint-disable-next-line no-var
// 			var remain = [];
// 			// eslint-disable-next-line no-var
// 			var k;
// 			for (k in alph) {
// 				if (!lettersGuessed.includes(k)) {
// 					remain.push(k);
// 				}
// 			}
// 			return ''.join(remain);
// 		}
//
// 		function hangman(secretWord) {
//
// 			// secretWord: string, the secret word to guess.
// 			//
// 			// Starts up an interactive game of Hangman.
// 			//
// 			// * Ask the user to supply one guess (i.e. letter) per round.
// 			//
// 			// * The user should receive feedback immediately after each guess
// 			//   about whether their guess appears in the computers word.
// 			//
// 			// * After each round, you should also display to the user the
// 			//   partially guessed word so far, as well as letters that the
// 			//   user has not yet guessed.
//
//
// 			message.channel.send('Welcome to the game, Hangman!');
// 			message.channel.send('I am thinking of a word that is', secretWord.length, 'letters long.');
// 			// eslint-disable-next-line no-var
// 			var mistakesMade = 0;
// 			// eslint-disable-next-line no-var
// 			var lettersGuessed = [];
//
// 			while (8 - mistakesMade > 0) {
// 				if (isWordGuessed(secretWord, lettersGuessed) == true) {
// 					message.channel.send('Congratulations, you won!');
// 					return;
// 				}
// 				else {
// 					message.channel.send('You have', 8 - mistakesMade, 'guesses left.');
// 					message.channel.send('Available letters:', getAvailableLetters(lettersGuessed));
// 					// eslint-disable-next-line no-var
// 					const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
// 					console.log(collector);
// 					collector.on('collect', msg => {
// 						// eslint-disable-next-line no-var
// 						var guess = msg.charAt(0);
// 						if (secretWord.includes(guess) && !lettersGuessed.includes(guess)) {
// 							lettersGuessed.push(guess);
// 							message.channel.send('Good guess:', getGuessedWord(secretWord, lettersGuessed));
// 						}
// 						else if (lettersGuessed.includes(guess)) {
// 							message.channel.send('Oops! You\'ve already guessed that letter:', getGuessedWord(secretWord, lettersGuessed));
// 						}
// 						else if (!secretWord.includes(guess)) {
// 							message.channel.send('Oops! That Oops! That letter is not in my word:', getGuessedWord(secretWord, lettersGuessed));
// 							lettersGuessed.push(guess);
// 							mistakesMade += 1;
// 						}
// 					});
// 				}
// 				if (8 - mistakesMade == 0) {
// 					message.channel.send('Sorry, you ran out of guesses. The word was', secretWord);
// 					return;
// 				}
// 				else {
// 					continue;
// 				}
// 			}
// 		}
//
// 		const secretWord = 'help';
// 		hangman(secretWord);
// 	},
// };
