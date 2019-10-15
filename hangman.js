const readline = require("readline");
words = require("./word-bank.json");
wordBank = [];

const initWordBank = () => {
  for (var i = 0; i < words.length; i++) {
    if (words[i].label.length > 4) {
      wordBank.push(words[i].label);
    }
  }
};
initWordBank();

const getSecretWord = arr => {
  const n = Math.floor(Math.random() * arr.length);
  let secretWord = arr[n];
  secretWord = secretWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  secretWord = secretWord.toUpperCase();
  return secretWord;
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const secretWord = getSecretWord(wordBank);
let counter = 10;
let guessed = [];

const secret = str => {
  let secretToGuess = "";
  for (let i = 0; i < str.length; i++) {
    if (guessed.indexOf(str[i]) !== -1) {
      secretToGuess += str[i];
    } else {
      secretToGuess += "*";
    }
  }
  return secretToGuess;
};
const drawing = num => {
  let draw = "   |---|\n";
  if (num < 9 ? (draw += "   o   |\n") : (draw += "       |\n"));
  if (num < 6 ? (draw += "  /|\\  |\n") : (draw += "       |\n"));
  if (num < 4 ? (draw += "   -   |\n") : (draw += "       |\n"));
  draw += `       |\n       |\n   ------\n`;
  return console.log(draw);
};
const checkin = () => {
  const toLog = secret(secretWord);
  console.log("");
  console.log(`You still have ${counter} guess`);
  console.log(`The word to guess: ${toLog}`);
  rl.question("What's your pick? ", answer => {
    if (/^[A-Za-z]$/.test(answer)) {
      answer = answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      answer = answer.toUpperCase();
      guessed.push(answer);
      if (toLog === secret(secretWord)) {
        counter--;
        drawing(counter);
        if (counter === 0) {
          console.log("FAIL");
          console.log(`The secret word was: ${secretWord}`);
          console.log(`
          |---|
          o   |
         /|\\  |
          -   |
         / \\  |
              |
          ------`);
          return rl.close();
        }
      }
    } else if (/^[A-Za-z]+$/.test(answer)) {
      console.log("");
      console.log("****** You should pick only 1 letter at a time!!! ******");
    } else {
      console.log("");
      console.log("****** You should pick only a letter!!! ******");
    }

    let reg = /\*/;
    if (reg.test(secret(secretWord))) {
      return checkin();
    } else {
      console.log(`GOT IT!! The secret word was: ${secret(secretWord)}`);
      rl.close();
    }
  });
};

checkin();
