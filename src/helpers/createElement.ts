interface options {
    className?: string;
    id?: string;
    text?: string;
    child?: Node | Node[];
    data?: [string, string];
}

export const _CE = (tagName: string, options: options): HTMLElement => {
    const element = document.createElement(tagName);

    if (options.className) element.className = options.className;
    if (options.id) element.id = options.id;

    // if (options.html !== undefined) element.innerHTML = options.html;

    if (options.text) element.innerText = options.text;

    if (options.child) {
        if (Array.isArray(options.child)) {
            element.append(...options.child);
        } else {
            element.appendChild(options.child);
        }
    }

    if (options.data) element.dataset[options.data[0]] = options.data[1];

    // if (options.attributes) {
    //   for (const [key, value] of Object.entries(options.attributes)) {
    //     element.setAttribute(key, value);
    //   }
    // }

    return element;
};
