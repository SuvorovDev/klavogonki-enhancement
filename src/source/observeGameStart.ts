import { textBox } from './defaultEl';

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
    } else {
        alert('Ошибка: observer запустился раньше загрузки элемента textBox!');
    }
};

export default observeGameStart;
