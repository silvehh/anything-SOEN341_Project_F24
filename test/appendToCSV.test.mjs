import { expect } from 'chai';
import { appendToCSV } from './appendToCSV.mjs'; // Adjust path to your `appendToCSV` function
import fs from 'fs';
import path from 'path';

describe('appendToCSV function', () => {
  const testDir = path.join(process.cwd(), 'test_files'); // Directory for test files
  const testFilePath = path.join(testDir, 'test.csv'); // Path for the test CSV file

  before(() => {
    // Create test directory if it doesn't exist
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
  });

  afterEach(() => {
    // Remove the test file after each test
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  after(() => {
    // Remove the test directory after all tests
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  it('should write headers and data to a new CSV file', async () => {
    const headers = ['name', 'age'];
    const data = { name: 'Alice', age: 30 };

    await appendToCSV(testFilePath, data, headers);

    const fileContent = fs.readFileSync(testFilePath, 'utf8');
    expect(fileContent).to.equal('name,age\nAlice,30\n');
  });

  it('should append data to an existing CSV file without writing headers again', async () => {
    const headers = ['name', 'age'];
    const initialData = { name: 'Alice', age: 30 };
    const appendedData = { name: 'Bob', age: 25 };

    // Write initial data to the file
    await appendToCSV(testFilePath, initialData, headers);

    // Append more data
    await appendToCSV(testFilePath, appendedData, headers);

    const fileContent = fs.readFileSync(testFilePath, 'utf8');
    expect(fileContent).to.equal('name,age\nAlice,30\nBob,25\n');
  });

  it('should handle an empty headers array gracefully', async () => {
    const headers = [];
    const data = { name: 'Alice', age: 30 };

    await appendToCSV(testFilePath, data, headers);

    const fileContent = fs.readFileSync(testFilePath, 'utf8');
    expect(fileContent).to.equal('Alice,30\n');
  });

  it('should reject the promise if the file path is invalid', async () => {
    const headers = ['name', 'age'];
    const data = { name: 'Alice', age: 30 };

    try {
      await appendToCSV('/invalid/path/test.csv', data, headers);
      throw new Error('Expected appendToCSV to throw an error, but it did not');
    } catch (error) {
      expect(error).to.be.an('error');
    }
  });
});
