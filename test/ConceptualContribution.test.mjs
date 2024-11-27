import { expect } from "chai";
import { JSDOM } from "jsdom";
import { validateForm } from "./ConceptualContribution.mjs";

describe("Conceptual Contribution Validation", () => {
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
                        <label for="q1">Conceptual Contribution</label><br>
                        <textarea id="q1" name="q1" placeholder="Write Here"></textarea>
                    </div>
                </form>
            </body>
            </html>
        `);

        document = dom.window.document;
    });

    it("should fail validation when 'Conceptual Contribution' is empty", () => {
        const form = document.querySelector("#assessment-form");
        const q1Field = form.querySelector("#q1");

        q1Field.value = ""; // Empty value
        const isValid = validateForm(form);

        expect(isValid).to.be.false; // Chai assertion
    });

    it("should pass validation when 'Conceptual Contribution' has a value", () => {
        const form = document.querySelector("#assessment-form");
        const q1Field = form.querySelector("#q1");

        q1Field.value = "Valid input"; // Valid value
        const isValid = validateForm(form);

        expect(isValid).to.be.true; // Chai assertion
    });
});
