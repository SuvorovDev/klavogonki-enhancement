import { gameBox } from '@static/defaultEl';
import { _CE } from '@/helpers';
import getText from '@game/text/getText';
import { generateTextNodes } from './text/getTextNodes';

const injectCustomRender = (): any => {
    const text = getText();
    console.log(text);

    // const typingBlock = document.createElement('div');
    // const typingBlock = `<div class="typing_block">${text}</div>`;
    // typingBlock.id = 'typing_block';
    // typingBlock.innerText = text;

    const typingBlock = _CE('div', {
        className: 'typing_block',
        children: generateTextNodes(text)
    });
    gameBox!.appendChild(typingBlock);
};

export default injectCustomRender;
