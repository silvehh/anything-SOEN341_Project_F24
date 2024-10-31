// app.test.js

const request = require('supertest');
const app = require('./app');

describe('Acceptance Tests', () => {
  test('Home page loads correctly', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    // Optionally, check for specific content
    expect(response.text).toContain('Welcome to My App');
  });
});
