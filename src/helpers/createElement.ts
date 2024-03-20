interface options {
    className?: string;
    id?: string;
    text?: string;
    child?: Node | Node[];
    data?: [string, string];
}

export const _CE = (tagName: string, options: options): HTMLElement => {
    const { className, id, text, child, data } = options;
    const element = document.createElement(tagName);

    if (className) element.className = className;
    if (id) element.id = id;
    if (text) element.innerText = text;

    if (child) {
        if (Array.isArray(child)) {
            element.append(...child);
        } else {
            element.appendChild(child);
        }
    }

    if (data) element.dataset[data[0]] = data[1];

    // if (options.html !== undefined) element.innerHTML = options.html;

    // if (options.attributes) {
    //   for (const [key, value] of Object.entries(options.attributes)) {
    //     element.setAttribute(key, value);
    //   }
    // }

    return element;
};
