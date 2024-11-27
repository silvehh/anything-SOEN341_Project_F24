import { expect } from "chai";
import { JSDOM } from "jsdom";
import { validateWorkEthic } from "./WorkEthic.mjs";

describe("Work Ethic Validation", () => {
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
                        <label for="q3">Work Ethic</label><br>
                        <textarea id="q3" name="q3" placeholder="Write Here"></textarea>
                    </div>
                </form>
            </body>
            </html>
        `);

        document = dom.window.document;
    });

    it("should fail validation when 'Work Ethic' is empty", () => {
        const form = document.querySelector("#assessment-form");
        const q3Field = form.querySelector("#q3");

        q3Field.value = ""; // Empty value
        const isValid = validateWorkEthic(form);

        expect(isValid).to.be.false; // Chai assertion
    });

    it("should pass validation when 'Work Ethic' has a value", () => {
        const form = document.querySelector("#assessment-form");
        const q3Field = form.querySelector("#q3");

        q3Field.value = "Works hard and stays committed"; // Valid input
        const isValid = validateWorkEthic(form);

        expect(isValid).to.be.true; // Chai assertion
    });
});
