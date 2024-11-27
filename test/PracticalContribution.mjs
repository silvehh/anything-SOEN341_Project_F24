export function validatePracticalContribution(form) {
    const q2Field = form.querySelector("#q2");
    if (!q2Field || q2Field.value.trim() === "") {
        return false; // Validation failed
    }
    return true; // Validation passed
}
