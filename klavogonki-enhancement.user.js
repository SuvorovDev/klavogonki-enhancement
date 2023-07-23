// ==UserScript==
// @name         klavogonki-enhancement OLD
// @version      0.0.3
// @author       MishaaDev
// @description  Replace default typing box on klavogonki.ru
// @supportURL   https://github.com/MishaaDev/klavogonki-enhancement

// @namespace    http://tampermonkey.net/
// @match        http://klavogonki.ru/g/*
// @match        https://klavogonki.ru/g/*
//
// @icon         https://raw.githubusercontent.com/MishaaDev/klavogonki-enhancement/master/script_icon.png

// @grant        GM_addStyle
// ==/UserScript==

function setAndRemoveSettings() {
    const typemod = document.getElementById('param_typemode');
    const highlight = document.getElementById('param_highlight');
    if (typemod.innerText !== 'весь текст') {
        typemod.click();
    }
    let i = 0;
    while (i < 5) {
        if (highlight.innerText === 'символ') {
            break;
        }
        highlight.click();
        i += 1;
    }
    typemod.parentNode.remove();
    highlight.parentNode.remove();

    const inputsize = document.getElementById('param_inputsize');
    inputsize.closest('tr').remove();
}

function setStyle(stylesArray) {
    const root = document.documentElement;
    stylesArray.forEach((e) => {
        root.style.setProperty(e.name, e.value);
    });
}

function checkStyle() {
    const isDark = getComputedStyle(document.documentElement).getPropertyValue('--darkgray');
    if (isDark) {
        setStyle(styleDark);
    } else {
        setStyle(styleDefault);
    }
}

const styleDark = [
    { name: '--main-text-color', value: '#cccccc' },
    { name: '--second-text-color', value: '#676c71' },
    { name: '--incorrect-text-color', value: '#f95454' },
    { name: '--incorrect-overwrite-text-color', value: '#911d1d' },
    { name: '--caret-color', value: '#90ee90' },
];

const styleDefault = [
    { name: '--main-text-color', value: '#222222' },
    { name: '--second-text-color', value: '#a7a7a7' },
    { name: '--incorrect-text-color', value: '#f00' },
    { name: '--incorrect-overwrite-text-color', value: '#b52f2f' },
    { name: '--caret-color', value: '#3333AA' },
];

const sourceTextState = []; // [beforefocus, typefocus, afterfocus]
const defaultTextBox = document.getElementById('typetext');
const defaultInput = document.getElementById('inputtext');
let inputState = '';

const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        sourceTextState[1] = document.getElementById('typefocus');
        if (!!sourceTextState[1]) {
            setAndRemoveSettings();
            checkStyle();
            whenTextReady();
        }
    });
});
observer.observe(defaultTextBox, { childList: true });

//   setTimeout(() => {
//       setAndRemoveSettings();
//       checkStyle();
//     whenTextReady();

//   }, 4000);

(function () {
    GM_addStyle(`
    #fixtypo {
      display: none !important;
    }

    #typeblock #inputtext {
      z-index: 0;
      border: none !important;
      position: absolute;
      caret-color: transparent;

      opacity: 0;
      top: -70px;
    }

    #typetext {
      display: none !important;
    }

    #typingBlock {
      position: relative;
      z-index: 20;
    }

    #words {
      transition: filter 0.2s ease-in-out;
    }

    .word {
      display: inline-block;
      font-family: "Roboto Mono", "Tahoma";
      margin: 0 5px;
      font-size: 25px;
      user-select: none;
      cursor: default;
      color: var(--second-text-color);
    }

    #focusError {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      visibility: hidden;
      opacity: 0;
      transition: visibility 0s, opacity 0.3s ease-in-out;
    }

    #focusError > b {
      font-size: 24px;
      user-select: none;
      cursor: default;
    }

    .letter.correct {
      color: var(--main-text-color);
    }

    .letter.incorrect {
      color: var(--incorrect-text-color);
    }

    .letter.incorrectOverwrite {
      color: var(--incorrect-overwrite-text-color);
    }

    @keyframes blink {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    #caret {
      background: var(--caret-color);
      width: 3px;
      border-radius: 0.5rem !important;
      height: 25px;
      position: fixed;
      animation: blink 0.5s infinite ease-in-out;
      transition: left 0.1s ease-in-out;
    }
  `);

    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute(
        'href',
        'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;600&display=swap',
    );
    document.head.appendChild(link);

    //   var isTextReady = document.getElementById("typetext");
    //   if (window.addEventListener) {
    //     // Normal browsers
    //     isTextReady.addEventListener("DOMSubtreeModified", textReady, false);
    //   }

    //   function textReady() {
    //     setAndRemoveSettings();
    //     checkStyle();

    //     setTimeout(() => {
    //       whenTextReady();
    //     }, 1000)
    //     isTextReady.removeEventListener("DOMSubtreeModified", textReady, false);
    //   }
})();

function whenTextReady() {
    const defaultInput = document.getElementById('inputtext');
    defaultInput.setAttribute('maxlength', 30);
    defaultInput.focus();

    document.getElementById('param_keyboard').addEventListener('click', (e) => {
        defaultInput.focus();
    });

    startGame();

    // ====== functions ======

    function getText() {
        const fieldOne = document.getElementById('beforefocus')?.innerText;
        const fieldTwo = document.getElementById('typefocus')?.innerText;
        const fieldThree = document.getElementById('afterfocus')?.innerText;
        const result = fieldOne + fieldTwo + fieldThree;
        return replaceSymbols(result.replace(/\s{2,}/gm, ' '));
        // return result.replace(/\s{2,}/gm, " ");
        // return result;
    }

    function replaceSymbols(str) {
        let result = str;
        const book = document.querySelector('#gamedesc > span > a')?.innerText || '';
        if (!book.match(/.*English.*/)) {
            result = result.replaceAll('o', 'о');
            result = result.replaceAll('c', 'с');
            result = result.replaceAll('ё', 'е');
            result = result.replaceAll('Ё', 'Е');
        }
        result = result.replaceAll('–', '-');
        result = result.replaceAll('—', '-');
        result = result.replaceAll('«', `"`);
        result = result.replaceAll('»', `"`);
        return result;
    }

    function formatWord(word) {
        // return `<div class="word"><span class="letter">${word
        //   .split("")
        //   .join('</span><span class="letter">')}</div>`;
        const letters = word.split('');
        const letterNodes = letters.map((letter) => {
            return `<span class="letter" data-letter='${
                letter === "'" ? '&#x27;' : letter
            }'>${letter}</span>`;
        });

        return `<div class="word">${letterNodes.join('')}</div>`;
    }

    function generateTextNodes() {
        const words = getText().split(' ');
        const wordsBlock = document.createElement('div');
        wordsBlock.id = 'words';
        words.forEach((word) => {
            wordsBlock.innerHTML += formatWord(word);
        });

        // console.log(words);
        return wordsBlock;
    }

    function injectTypingBlock() {
        const typingBlock = document.createElement('div');
        typingBlock.id = 'typingBlock';
        typingBlock.appendChild(generateTextNodes());

        const originalBlock = document.getElementById('typeplayblock');
        originalBlock.appendChild(typingBlock);

        makeCaret();

        typingBlock.appendChild(focusError());
        typingBlock.addEventListener('click', (e) => {
            defaultInput.focus();
        });
    }

    function focusError() {
        const focusError = document.createElement('div');
        focusError.id = 'focusError';
        focusError.innerHTML = '<b>Кликните, что бы вернуть фокус!</b>';

        const words = document.getElementById('words');
        const caret = document.getElementById('caret');
        defaultInput.addEventListener('focus', (e) => {
            focusError.style.visibility = 'hidden';
            focusError.style.opacity = '0';
            caret.style.display = 'block';
            words.style.filter = 'blur(0)';
        });
        defaultInput.addEventListener('blur', (e) => {
            focusError.style.visibility = 'visible';
            focusError.style.opacity = '1';
            caret.style.display = 'none';
            words.style.filter = 'blur(5px)';
        });

        return focusError;
    }

    function makeCaret() {
        const caret = document.createElement('div');
        caret.id = 'caret';
        document.getElementById('typingBlock').appendChild(caret);
    }

    function caretMoving() {
        const nextLetter = document.querySelector('.letter.current');
        const nextWord = document.querySelector('.word.current');
        const caret = document.getElementById('caret');
        caret.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 5 + 'px';
        if (nextLetter) {
            if (nextLetter.classList.contains('incorrectOverwrite')) {
                caret.style.left = nextLetter.getBoundingClientRect().right - 1 + 'px';
            } else {
                caret.style.left = nextLetter.getBoundingClientRect().left - 1 + 'px';
            }
        } else {
            caret.style.left = nextWord.getBoundingClientRect().right - 1 + 'px';
        }
    }

    function keyPressListener() {
        defaultInput.addEventListener('keydown', (e) => {
            let key = e.key;
            const currentWord = document.querySelector('.word.current');

            const isDone = currentWord.classList.contains('done');
            const isDoneWrong = currentWord.classList.contains('doneWrong');
            const isLetter = key.length === 1;
            const isSpace = key === ' ';
            const isBackspace = key === 'Backspace';

            if (isSpace) {
                key = '_';
            }

            if (!isDone && !isDoneWrong) {
                const currentLetter = document.querySelector('.letter.current');
                const expectedLetter = currentLetter.dataset.letter;
                // console.log({ key, expectedLetter });

                if (isLetter) {
                    if (key === expectedLetter) {
                        currentLetter.classList.add('correct');
                    } else {
                        currentLetter.classList.add('incorrect');
                        currentLetter.innerText = key;
                    }

                    currentLetter.classList.remove('current');
                    if (currentLetter.nextSibling) {
                        currentLetter.nextSibling.classList.add('current');
                    } else {
                        const isCorrect =
                            currentWord.children.length ===
                            currentWord.querySelectorAll('.correct').length;
                        if (isCorrect) {
                            currentWord.classList.add('done');
                        } else {
                            currentWord.classList.add('doneWrong');
                        }
                    }
                }

                if (isBackspace) {
                    const isFirst = currentWord.firstChild === currentLetter;
                    if (!isFirst) {
                        currentLetter.classList.remove('current');
                        const previousLetter = currentLetter.previousSibling;
                        previousLetter.classList.add('current');
                        previousLetter.classList.remove('correct', 'incorrect');
                        previousLetter.innerText = previousLetter.dataset.letter;
                    }
                }
            }

            if (isDone && isSpace) {
                const isOverwrited = currentWord.querySelector('.incorrectOverwrite');
                if (!isOverwrited) {
                    currentWord.classList.remove('current');
                    const nextWord = currentWord.nextSibling;
                    nextWord.classList.add('current');
                    nextWord.firstChild.classList.add('current');
                } else {
                    const appendLetter = document.createElement('span');
                    appendLetter.classList.add('letter', 'incorrectOverwrite');
                    appendLetter.innerText = key;
                    currentWord.appendChild(appendLetter);
                }
            }

            if (isDoneWrong || (isDone && !isSpace)) {
                if (isLetter && currentWord.children.length < 30) {
                    const appendLetter = document.createElement('span');
                    appendLetter.classList.add('letter', 'incorrectOverwrite');
                    appendLetter.dataset.letter = key;
                    appendLetter.innerText = key;
                    currentWord.appendChild(appendLetter);
                }

                if (isBackspace) {
                    const lastLetter = currentWord.lastChild;
                    if (lastLetter.classList.contains('incorrectOverwrite')) {
                        lastLetter.remove();
                    } else {
                        currentWord.classList.remove('done', 'doneWrong');
                        lastLetter.classList.add('current');
                        lastLetter.classList.remove('correct', 'incorrect');
                        lastLetter.innerText = lastLetter.dataset.letter;
                    }
                }
            }

            if (isBackspace && e.ctrlKey) {
                const overwriteLetters = document.querySelectorAll('.word .incorrectOverwrite');
                overwriteLetters.forEach((e) => {
                    e.remove();
                });

                const lettersArray = currentWord.childNodes;
                lettersArray.forEach((e) => {
                    e.className = 'letter';
                    e.innerText = e.dataset.letter;
                });
                lettersArray[0].classList.add('current');

                defaultInput.value = '';

                currentWord.classList.remove('done', 'doneWrong');
                caretMoving();
            }

            caretMoving();
        });
    }

    function startGame() {
        injectTypingBlock();

        document.querySelector('.word').classList.add('current');
        document.querySelector('.letter').classList.add('current');

        caretMoving();
        keyPressListener();
    }
}
