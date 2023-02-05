export function isValidEmail(value) {
    return /^\w+([.+-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/.test(value);
}