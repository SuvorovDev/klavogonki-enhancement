import { gameBox } from '@static/defaultEl';
import { _CE } from '@/helpers';
import getText from '@game/text/getText';
import { generateTextNodes } from './text/getTextNodes';

const injectCustomRender = (): any => {
    const text = getText();
    console.log(text);

    const typingBlock = _CE('div', {
        className: 'typing_block',
        child: generateTextNodes(text)
    });
    gameBox!.appendChild(typingBlock);
};

export default injectCustomRender;
