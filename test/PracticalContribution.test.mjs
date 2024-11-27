import { expect } from "chai";
import { JSDOM } from "jsdom";
import { validatePracticalContribution } from "./PracticalContribution.mjs";

describe("Practical Contribution Validation", () => {
    let document;

    beforeEach(() => {
        const dom = new JSDOM(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Dimension-Based Assessment</title>
            </head>
            <body>
                <form id="assessment-form">
                    <div class="dimension">
                        <label for="q2">Practical Contribution</label><br>
                        <textarea id="q2" name="q2" placeholder="Write Here"></textarea>
                    </div>
                </form>
            </body>
            </html>
        `);

        document = dom.window.document;
    });

    it("should fail validation when 'Practical Contribution' is empty", () => {
        const form = document.querySelector("#assessment-form");
        const q2Field = form.querySelector("#q2");

        q2Field.value = ""; // Empty value
        const isValid = validatePracticalContribution(form);

        expect(isValid).to.be.false; // Chai assertion
    });

    it("should pass validation when 'Practical Contribution' has a value", () => {
        const form = document.querySelector("#assessment-form");
        const q2Field = form.querySelector("#q2");

        q2Field.value = "Valid input"; // Valid value
        const isValid = validatePracticalContribution(form);

        expect(isValid).to.be.true; // Chai assertion
    });
});
