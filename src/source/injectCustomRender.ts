import getText from './getText';

const injectCustomRender = (): any => {
    const text = getText();
    console.log(text);
};

export default injectCustomRender;
