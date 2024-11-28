import { expect } from 'chai';
import { readCSV } from './readCSV.mjs'; // Adjust the path to your `readCSV` function
import fs from 'fs';
import path from 'path';
import * as csv from 'fast-csv'; // Ensure `csv` is properly installed

describe('readCSV function', () => {
  const testDir = path.join(process.cwd(), 'test_files'); // Temporary directory for tests
  const testFilePath = path.join(testDir, 'test.csv'); // Path for test CSV file

  before(() => {
    // Create test directory if it doesn't exist
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
  });

  after(() => {
    // Remove test directory and files after tests
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  it('should return an empty array if the file does not exist', async () => {
    const data = await readCSV('nonexistent.csv'); // Provide a non-existent file
    expect(data).to.deep.equal([]); // Expect the function to return an empty array
  });

  it('should read a valid CSV file', async () => {
    const csvContent = `name,age\nAlice,30\nBob,25`; // Sample CSV content
    fs.writeFileSync(testFilePath, csvContent, 'utf8'); // Write test CSV file

    const data = await readCSV(testFilePath); // Read the CSV file
    expect(data).to.deep.equal([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ]);
  });

  it('should handle an empty CSV file gracefully', async () => {
    fs.writeFileSync(testFilePath, '', 'utf8'); // Create an empty CSV file

    const data = await readCSV(testFilePath); // Read the empty file
    expect(data).to.deep.equal([]); // Expect the function to return an empty array
  });

  it('should reject with an error if the CSV file is malformed', async () => {
    const invalidCsvContent = `name,age\nAlice\nBob,25`; // Malformed CSV content
    fs.writeFileSync(testFilePath, invalidCsvContent, 'utf8'); // Write invalid CSV file

    try {
      await readCSV(testFilePath); // Attempt to read malformed CSV file
      throw new Error('Expected readCSV to throw an error, but it did not');
    } catch (error) {
      expect(error).to.be.an('error'); // Expect the function to throw an error
    }
  });
});
