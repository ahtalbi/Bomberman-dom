export function createElement(type, props, ...children) {
    if (typeof type === "function") {
        return type({ ...(props || {}), children });
    }

    const ele = document.createElement(type);

    for (const key in props || {}) {
        ele.setAttribute(key, props[key]);
    }

    const flatChildren = children.flat(Infinity);
    ele.append( ...flatChildren.filter( child => child !== null && child !== undefined && child !== false));

    return ele;
}

export function render(element, container) {
    container.replaceChildren(element);
}
