import { textBox } from '@static/defaultEl';

const observeGameStart = (someFunc: () => void) => {
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.target.hasChildNodes()) {
                someFunc();
                observer.disconnect();
            }
        });
    });
    if (textBox !== null) {
        observer.observe(textBox, { childList: true });
    }
};

export default observeGameStart;
