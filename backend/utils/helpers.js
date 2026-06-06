export function generateRandomDigits(numberOfDigits = 6) {
    let res = "";
    for (let i = 0; i < numberOfDigits; i++) {
        res += Math.floor(Math.random() * 10);
    }
    return res;
}