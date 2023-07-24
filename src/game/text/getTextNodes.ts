export const generateTextNodes = (text: string) => {
    const words = text.split(/\s+/);
    const wordsNodes = document.createElement('div');

    console.log(words);

    wordsNodes.id = 'words';
    words.forEach((word) => {
        // generate letters span's
        const letters = word.split('');
        const letterNodes = letters.map((letter) => {
            const node = document.createElement('span');
            node.className = 'letter';
            node.dataset.letter = letter;
            node.innerText = letter;
            return node;
        });

        //generate words div's
        const wordNode = document.createElement('div');
        wordNode.className = 'word';
        wordNode.append(...letterNodes);

        wordsNodes.appendChild(wordNode);
    });

    return wordsNodes;
};
