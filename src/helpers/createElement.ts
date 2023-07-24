interface options {
    className?: string;
    id?: string;
    text?: string;
    children?: Node;
}

export const _CE = (tagName: string, options: options): HTMLElement => {
    const element = document.createElement(tagName);

    if (options.className) element.className = options.className;
    if (options.id) element.id = options.id;

    // if (options.html !== undefined) element.innerHTML = options.html;

    // if (options.text) element.innerText = options.text;

    if (options.children) element.appendChild(options.children);

    // if (options.attributes) {
    //   for (const [key, value] of Object.entries(options.attributes)) {
    //     element.setAttribute(key, value);
    //   }
    // }

    return element;
};
