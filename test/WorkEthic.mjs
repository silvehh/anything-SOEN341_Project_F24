export function validateWorkEthic(form) {
    const q3Field = form.querySelector("#q3");
    if (!q3Field || q3Field.value.trim() === "") {
        return false; // Validation failed
    }
    return true; // Validation passed
}
