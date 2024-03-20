import { _CE } from '@/helpers';

const createTextNodes = (text: string) => {
    const words = text.split(/\s+/);
    const wordsNodes = _CE('div', { id: 'words' });

    words.forEach((word) => {
        // create letters span's
        const letters = word.split('');
        const letterNodes = letters.map((letter) => {
            return _CE('span', {
                className: 'letter',
                data: ['letter', letter],
                text: letter
            });
        });

        // create words div's
        const wordNode = _CE('div', {
            className: 'word',
            child: letterNodes
        });

        wordsNodes.appendChild(wordNode);
    });

    wordsNodes.querySelector('.word')!.classList.add('current');
    wordsNodes.querySelector('.letter')!.classList.add('current');

    return wordsNodes;
};

export default createTextNodes;