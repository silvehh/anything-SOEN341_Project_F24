export function isValidPassword(password) {
    if (typeof password !== 'string') return false;
    const hasLetter = /[a-z]/.test(password);
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasCapitalLetter && hasNumber;
}