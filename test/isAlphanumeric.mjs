//exporting alphanumeral function
export function isAlphanumeric(input) {

    const alphanumericRegex = /^[a-zA-Z0-9 ]+$/; // Check if inputs is only letter, numbers or space
    return alphanumericRegex.test(input);

}