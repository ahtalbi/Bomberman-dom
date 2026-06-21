export function debounce(func, wait) {
    let timeout = null;
    let fn = () => {
        if (timeout) {
            return;
        } else {
            timeout = setTimeout(() => {
                clearTimeout(timeout);
                timeout = null;
            }, wait);
            return func();
        }
    }
    return fn;
}