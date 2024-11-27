export function validateForm(form) {
    const q1Field = form.querySelector("#q1");
    if (!q1Field || q1Field.value.trim() === "") {
        return false; // Validation failed
    }
    return true; // Validation passed
}