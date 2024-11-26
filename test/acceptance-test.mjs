import puppeteer from 'puppeteer';
import { expect } from 'chai';

describe('Student Rating and Dimension Assessment Flow', function () {
  this.timeout(30000);
  let browser, page;

  before(async function () {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  after(async function () {
    await browser.close();
  });

  it('should open the login page', async function () {
    await page.goto('https://assessything.up.railway.app/student-login');
    const title = await page.title();
    expect(title).to.include('Login');
  });

  it('should log in as a student', async function () {
    await page.type('input[name="email"]', 'teststudent1@student.com');
    await page.type('input[name="password"]', 'testpassword');
    await page.click('button[type="submit"]');
    await page.waitForSelector('h2');
    const headingText = await page.$eval('h2', el => el.textContent);
    expect(headingText).to.include('Teammates');
  });

  it('should navigate to the evaluation page', async function () {
    await page.goto('https://assessything.up.railway.app/evaluate?evaluateeEmail=teststudent2@student.com');
    await page.waitForSelector('h1');
    const evaluationHeading = await page.$eval('h1', el => el.textContent);
    expect(evaluationHeading).to.include('Evaluate');
  });

  it('should rate the student', async function () {
    await page.type('#rating', '5');
    await page.click('.btn');
    await page.waitForSelector('h2');
    const assessmentHeading = await page.$eval('h2', el => el.textContent);
    expect(assessmentHeading).to.include('Further Evaluation of Tester-Student-2');
  });

  it('should complete the dimension-based assessment', async function () {
    await page.type('#q1', 'Demonstrated good understanding of concepts');
    await page.type('#q2', 'Contributed significantly to practical tasks');
    await page.type('#q3', 'Showed strong work ethic throughout the project');
    await page.click('.btn');
  });

  it('should display the confirmation page', async function () {
    await page.waitForSelector('h1');
    const confirmationText = await page.$eval('h1', el => el.textContent);
    expect(confirmationText).to.include('Thank You!');
  });
});
