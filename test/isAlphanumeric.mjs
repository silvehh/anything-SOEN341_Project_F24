export function isAlphanumeric(input) {
    const alphanumericRegex = /^[a-zA-Z0-9 ]+$/; 
    return alphanumericRegex.test(input);
}