import { gameBox } from '@static/defaultEl';
import { _CE } from '@/helpers';
import getText from '@game/text/getText';
import createTextNodes from '@game/text/createTextNodes';

const injectCustomRender = (): any => {
    const text = getText();
    console.log(text);

    const typingBlock = _CE('div', {
        className: 'typing_block',
        child: createTextNodes(text)
    });
    gameBox!.appendChild(typingBlock);
};

export default injectCustomRender;
