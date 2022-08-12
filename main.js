function setAndRemoveSettings() {
  const typemod = document.getElementById("param_typemode");
  const highlight = document.getElementById("param_highlight");
  if (typemod.innerText !== "весь текст") {
    typemod.click();
  }
  let i = 0;
  while (i < 5) {
    if (highlight.innerText === "символ") {
      break;
    }
    highlight.click();
    i += 1;
  }
  typemod.parentNode.remove();
  highlight.parentNode.remove();

  const inputsize = document.getElementById("param_inputsize");
  inputsize.closest("tr").remove();
}

function setStyle(stylesArray) {
  const root = document.documentElement;
  stylesArray.forEach((e) => {
    root.style.setProperty(e.name, e.value);
  });
}

function checkStyle() {
  const isDark = getComputedStyle(document.documentElement).getPropertyValue(
    "--darkgray"
  );
  if (isDark) {
    setStyle(styleDark);
  } else {
    setStyle(styleDefault);
  }
}

const styleDark = [
  { name: "--main-text-color", value: "#cccccc" },
  { name: "--second-text-color", value: "#676c71" },
  { name: "--incorrect-text-color", value: "#f95454" },
  { name: "--incorrect-overwrite-text-color", value: "#911d1d" },
  { name: "--caret-color", value: "#90ee90" },
];

const styleDefault = [
  { name: "--main-text-color", value: "#222222" },
  { name: "--second-text-color", value: "#a7a7a7" },
  { name: "--incorrect-text-color", value: "#f00" },
  { name: "--incorrect-overwrite-text-color", value: "#b52f2f" },
  { name: "--caret-color", value: "#3333AA" },
];

setAndRemoveSettings();

var link = document.createElement("link");
link.setAttribute("rel", "stylesheet");
link.setAttribute("type", "text/css");
link.setAttribute(
  "href",
  "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;600&display=swap"
);
document.head.appendChild(link);

// ====== When text ready ======

const defaultInput = document.getElementById("inputtext");
defaultInput.setAttribute("maxlength", 30);
defaultInput.focus();

document.getElementById("param_keyboard").addEventListener("click", (e) => {
  defaultInput.focus();
});

startGame();

// ====== functions ======

function getText() {
  const fieldOne = document.getElementById("beforefocus")?.innerText;
  const fieldTwo = document.getElementById("typefocus")?.innerText;
  const fieldThree = document.getElementById("afterfocus")?.innerText;
  const result = fieldOne + fieldTwo + fieldThree;
  return replaceSymbols(result.replace(/\s{2,}/gm, " "));
}

function replaceSymbols(str) {
  let result = str;
  const book = document.querySelector("#gamedesc > span > a")?.innerText || "";
  if (!book.match(/.*English.*/)) {
    result = result.replaceAll("o", "о");
    result = result.replaceAll("c", "с");
    result = result.replaceAll("ё", "е");
    result = result.replaceAll("Ё", "Е");
  }
  result = result.replaceAll("–", "-");
  result = result.replaceAll("—", "-");
  result = result.replaceAll("«", `"`);
  result = result.replaceAll("»", `"`);
  return result;
}

function formatWord(word) {
  // return `<div class="word"><span class="letter">${word
  //   .split("")
  //   .join('</span><span class="letter">')}</div>`;
  const letters = word.split("");
  const letterNodes = letters.map((letter) => {
    return `<span class="letter" data-letter='${
      letter === "'" ? "&#x27;" : letter
    }'>${letter}</span>`;
  });

  return `<div class="word">${letterNodes.join("")}</div>`;
}

function generateTextNodes() {
  const words = getText().split(" ");
  const wordsBlock = document.createElement("div");
  wordsBlock.id = "words";
  words.forEach((word) => {
    wordsBlock.innerHTML += formatWord(word);
  });

  console.log(words);
  return wordsBlock;
}

function injectTypingBlock() {
  const typingBlock = document.createElement("div");
  typingBlock.id = "typingBlock";
  typingBlock.appendChild(generateTextNodes());

  const originalBlock = document.getElementById("typeplayblock");
  originalBlock.appendChild(typingBlock);

  makeCaret();

  typingBlock.appendChild(focusError());
  typingBlock.addEventListener("click", (e) => {
    defaultInput.focus();
  });
}

function focusError() {
  const focusError = document.createElement("div");
  focusError.id = "focusError";
  focusError.innerHTML = "<b>Кликните, что бы вернуть фокус!</b>";

  const words = document.getElementById("words");
  const caret = document.getElementById("caret");
  defaultInput.addEventListener("focus", (e) => {
    focusError.style.visibility = "hidden";
    focusError.style.opacity = "0";
    caret.style.display = "block";
    words.style.filter = "blur(0)";
    console.log("focus");
  });
  defaultInput.addEventListener("blur", (e) => {
    focusError.style.visibility = "visible";
    focusError.style.opacity = "1";
    caret.style.display = "none";
    words.style.filter = "blur(5px)";
    console.log("blur");
  });

  return focusError;
}

function makeCaret() {
  const caret = document.createElement("div");
  caret.id = "caret";
  document.getElementById("typingBlock").appendChild(caret);
}

function caretMoving() {
  const nextLetter = document.querySelector(".letter.current");
  const nextWord = document.querySelector(".word.current");
  const caret = document.getElementById("caret");
  caret.style.top =
    (nextLetter || nextWord).getBoundingClientRect().top + 5 + "px";
  if (nextLetter) {
    if (nextLetter.classList.contains("incorrectOverwrite")) {
      caret.style.left = nextLetter.getBoundingClientRect().right - 1 + "px";
    } else {
      caret.style.left = nextLetter.getBoundingClientRect().left - 1 + "px";
    }
  } else {
    caret.style.left = nextWord.getBoundingClientRect().right - 1 + "px";
  }
}

function keyPressListener() {
  defaultInput.addEventListener("keydown", (e) => {
    const key = e.key;
    const currentWord = document.querySelector(".word.current");

    const isDone = currentWord.classList.contains("done");
    const isDoneWrong = currentWord.classList.contains("doneWrong");
    const isLetter = key.length === 1;
    const isSpace = key === " ";
    const isBackspace = key === "Backspace";

    if (!isDone && !isDoneWrong) {
      const currentLetter = document.querySelector(".letter.current");
      const expectedLetter = currentLetter.dataset.letter;
      console.log({ key, expectedLetter });

      if (isLetter) {
        if (key === expectedLetter) {
          currentLetter.classList.add("correct");
        } else {
          currentLetter.classList.add("incorrect");
          if (!isSpace) {
            currentLetter.innerText = key;
          } else {
            currentLetter.innerText = "_";
          }
        }

        currentLetter.classList.remove("current");
        if (currentLetter.nextSibling) {
          currentLetter.nextSibling.classList.add("current");
        } else {
          const isCorrect =
            currentWord.children.length ===
            currentWord.querySelectorAll(".correct").length;
          if (isCorrect) {
            currentWord.classList.add("done");
          } else {
            currentWord.classList.add("doneWrong");
          }
        }
      }

      if (isBackspace) {
        const isFirst = currentWord.firstChild === currentLetter;
        if (!isFirst) {
          currentLetter.classList.remove("current");
          const previousLetter = currentLetter.previousSibling;
          previousLetter.classList.add("current");
          previousLetter.classList.remove("correct", "incorrect");
          previousLetter.innerText = previousLetter.dataset.letter;
        }
      }
    }

    if (isDone && isSpace) {
      const isOverwrited = currentWord.querySelector(".incorrectOverwrite");
      if (!isOverwrited) {
        currentWord.classList.remove("current");
        const nextWord = currentWord.nextSibling;
        nextWord.classList.add("current");
        nextWord.firstChild.classList.add("current");
      } else {
        const appendLetter = document.createElement("span");
        appendLetter.classList.add("letter", "incorrectOverwrite");
        appendLetter.dataset.letter = "_";
        appendLetter.innerText = "_";
        currentWord.appendChild(appendLetter);
      }
    }

    if (isDoneWrong || (isDone && !isSpace)) {
      if (isLetter && currentWord.children.length < 30) {
        const appendLetter = document.createElement("span");
        appendLetter.classList.add("letter", "incorrectOverwrite");
        appendLetter.dataset.letter = key;
        if (!isSpace) {
          appendLetter.innerText = key;
        } else {
          appendLetter.innerText = "_";
        }
        currentWord.appendChild(appendLetter);
      }

      if (isBackspace) {
        const lastLetter = currentWord.lastChild;
        if (lastLetter.classList.contains("incorrectOverwrite")) {
          lastLetter.remove();
        } else {
          currentWord.classList.remove("done", "doneWrong");
          lastLetter.classList.add("current");
          lastLetter.classList.remove("correct", "incorrect");
          lastLetter.innerText = lastLetter.dataset.letter;
        }
      }
    }

    if (isBackspace && e.ctrlKey) {
      const overwriteLetters = document.querySelectorAll(
        ".word .incorrectOverwrite"
      );
      overwriteLetters.forEach((e) => {
        e.remove();
      });

      const lettersArray = currentWord.childNodes;
      lettersArray.forEach((e) => {
        e.className = "letter";
        e.classList.add("letter");
        e.innerText = e.dataset.letter;
      });
      lettersArray[0].classList.add("current");

      currentWord.classList.remove("done", "doneWrong");
      caretMoving();
    }

    caretMoving();
  });
}

function startGame() {
  checkStyle();
  injectTypingBlock();

  document.querySelector(".word").classList.add("current");
  document.querySelector(".letter").classList.add("current");

  caretMoving();
  keyPressListener();
}
