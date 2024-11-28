import { expect } from 'chai';
import { readCSV } from './readCSV.mjs'; // Adjust the path to point to the actual location of your `readCSV` function
import fs from 'fs';
import path from 'path';

describe('readCSV function', () => {
  const testDir = path.join(process.cwd(), 'test_files');
  const testFilePath = path.join(testDir, 'test.csv');

  before(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
  });

  after(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  it('should return an empty array if the file does not exist', async () => {
    const data = await readCSV('nonexistent.csv');
    expect(data).to.deep.equal([]);
  });

  it('should read a valid CSV file', async () => {
    const csvContent = `name,age\nAlice,30\nBob,25`;
    fs.writeFileSync(testFilePath, csvContent, 'utf8');

    const data = await readCSV(testFilePath);
    expect(data).to.deep.equal([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ]);
  });
});
