import puppeteer from 'puppeteer';
import { expect } from 'chai';

describe('Student Rating and Dimension Assessment Flow', function () {
  this.timeout(30000); // Allow more time for Puppeteer to complete actions if needed
  let browser, page;

  before(async function () {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  after(async function () {
    await browser.close();
  });

  it('should log in as a student, rate another student, complete further assessment, and see the confirmation page', async function () {
    // Open the login page
    await page.goto('http://localhost:3000/student-login');

    // Log in as a test student
    await page.type('input[name="email"]', 'teststudent1@student.com'); // Replace with test email
    await page.type('input[name="password"]', 'testpassword'); // Replace with test password
    await page.click('button[type="submit"]'); // Update to the actual login button ID

    // Wait for the teammates page to load after login
    await page.waitForSelector('h2'); // Update selector to match the teammates page

    // Navigate to the evaluation page for a specific student
    await page.goto('http://localhost:3000/evaluate?evaluateeEmail=teststudent2@student.com'); // Replace with the appropriate evaluatee email

    // Verify evaluation page loaded and rate the student
    await page.waitForSelector('h1'); // Wait for the heading to load
    await page.type('#rating', '5'); // Set the rating field
    await page.click('.btn'); // Click the "Next" button to submit the rating

    // Wait for the dimension assessment page to load
    await page.waitForSelector('h2'); // Heading on the Dimension-Based Assessment page

    // Fill out the three textboxes
    await page.type('#q1', 'Demonstrated good understanding of concepts');
    await page.type('#q2', 'Contributed significantly to practical tasks');
    await page.type('#q3', 'Showed strong work ethic throughout the project');

    // Submit the dimension-based assessment
    await page.click('.btn'); // Click the "Submit Assessment" button

    // Check if redirected to the confirmation page
    await page.waitForSelector('h1'); // Wait for confirmation heading
    const confirmationText = await page.$eval('h1', el => el.textContent);
    expect(confirmationText).to.include('Thank You!');
  });
});
