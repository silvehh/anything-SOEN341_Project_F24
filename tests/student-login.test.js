const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../app');

jest.mock('fs'); 

describe('POST /student-login', () => {
  
  const mockFilePath = path.join(__dirname, '..', 'data', 'students.csv');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should log in successfully with correct credentials', async () => {
    const mockData = 'John Doe,johndoe@example.com,password123\nJane Doe,janedoe@example.com,pass456';
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(null, mockData);
    });

    const response = await request(app)
      .post('/student-login')
      .send({ email: 'johndoe@example.com', password: 'password123' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/teammates');
  });

  test('should return an error for incorrect credentials', async () => {
    const mockData = 'John Doe,johndoe@example.com,password123\nJane Doe,janedoe@example.com,pass456';
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(null, mockData);
    });

    const response = await request(app)
      .post('/student-login')
      .send({ email: 'johndoe@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/student-login?error=invalid_credentials');
  });

  test('should return an error if email is not found', async () => {
    const mockData = 'John Doe,johndoe@example.com,password123\nJane Doe,janedoe@example.com,pass456';
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(null, mockData);
    });

    const response = await request(app)
      .post('/student-login')
      .send({ email: 'nonexistent@example.com', password: 'password123' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/student-login?error=invalid_credentials');
  });

  test('should return a server error if CSV file cannot be read', async () => {
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(new Error('File read error'));
    });

    const response = await request(app)
      .post('/student-login')
      .send({ email: 'johndoe@example.com', password: 'password123' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('An error occurred, please try again.');
  });
});
