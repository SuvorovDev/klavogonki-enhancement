const fixStupidShit = (text: string) => {
    const re = /[а-я]/;
    if (re.test(text)) {
        return text.replaceAll('o', 'о').replaceAll('c', 'с');
    }
    return text;
};

const getText = (): string => {
    let text = '';
    const textFieldsId = ['beforefocus', 'typefocus', 'afterfocus'];
    textFieldsId.forEach((id) => {
        const textField = document.getElementById(id);
        if (textField?.childElementCount === 0 || textField?.children[0].tagName === 'BR') {
            text = text.concat(textField.innerText);
        } else {
            const arr = Array.from(textField!.children as HTMLCollectionOf<HTMLElement>);

            arr.filter((e) => e.style.display !== 'none').forEach(
                (e) => (text = text.concat(e.innerText))
            );
        }
    });

    return fixStupidShit(text);
};

export default getText;
