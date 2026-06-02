export function createElement(type, props, ...children) {
    if (typeof type === "function") {
        return type({ ...(props || {}), children });
    }

    const ele = document.createElement(type);

    for (const key in props || {}) {
        if (key.startsWith("on") && typeof props[key] === "function") {
            const eventName = key.slice(2).toLowerCase();
            ele.addEventListener(eventName, props[key]);
        } else {
            ele.setAttribute(key, props[key]);
        }
    }

    const flatChildren = children.flat(Infinity);
    ele.append(...flatChildren.filter(child => child !== null && child !== undefined && child !== false));

    return ele;
}

export function render(element, container) {
    container.replaceChildren(element);
}
