import puppeteer from 'puppeteer';
import { expect } from 'chai';

describe('Student Rating and Dimension Assessment Flow', function () {
  this.timeout(30000);
  let browser, page;

  before(async function () {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
  });

  after(async function () {
    await browser.close();
  });

  it('should log in as a student, rate another student, complete further assessment, and see the confirmation page', async function () {
    // Open the login page
    await page.goto('https://assessything.up.railway.app/student-login');

    // Log in as a test student
    await page.type('input[name="email"]', 'teststudent1@student.com');
    await page.type('input[name="password"]', 'testpassword');
    await page.click('button[type="submit"]');

    // Wait for the teammates page to load after login
    await page.waitForSelector('h2');

    // Navigate to the evaluation page for a specific student
    await page.goto('https://assessything.up.railway.app/evaluate?evaluateeEmail=teststudent2@student.com'); // Replace with the appropriate evaluatee email

    // Verify evaluation page loaded and rate the student
    await page.waitForSelector('h1');
    await page.type('#rating', '5');
    await page.click('.btn');

    await page.waitForSelector('h2'); // Heading on the Dimension-Based Assessment page

    // Fill out the three textboxes
    await page.type('#q1', 'Demonstrated good understanding of concepts');
    await page.type('#q2', 'Contributed significantly to practical tasks');
    await page.type('#q3', 'Showed strong work ethic throughout the project');

    await page.click('.btn'); // Click the "Submit Assessment" button

    await page.waitForSelector('h1'); // Wait for confirmation heading
    const confirmationText = await page.$eval('h1', el => el.textContent);
    expect(confirmationText).to.include('Thank You!');
  });
});
