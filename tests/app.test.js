// app.test.js

const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const path = require('path');

beforeAll(() => {
  // Create 'data' directory if it doesn't exist
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  // Create mock CSV files
  const studentsCsv = path.join(dataDir, 'students.csv');
  const teachersCsv = path.join(dataDir, 'teachers.csv');

  fs.writeFileSync(
    studentsCsv,
    'name,email,password\nTest Student,teststudent@example.com,$2b$10$hashedpassword'
  );

  fs.writeFileSync(
    teachersCsv,
    'name,email,password\nTest Teacher,testteacher@example.com,$2b$10$hashedpassword'
  );
});

afterAll(() => {
  // Clean up test data
  const dataDir = path.join(__dirname, 'data');
  fs.rmSync(dataDir, { recursive: true, force: true });
});

describe('Acceptance Tests', () => {
  test('Home page loads correctly', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Welcome');
  });

  // Add more tests as needed
});
