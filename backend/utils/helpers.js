export function generateRandomDigits() {
    let res = "";
    for (let i = 0; i < 6; i++) {
        res += Math.floor(Math.random() * 10);
    }
    return res;
}