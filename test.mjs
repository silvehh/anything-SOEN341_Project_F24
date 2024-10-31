import request from 'supertest'
import app from './app.js'

test("Hello world!", (t) =>{
    t.pass();
})

test("GET / - should load the homepage", async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
  
const request = require('supertest'); // Import request from Supertest
const app = require('./app'); // Adjust the path to your app file

describe('GET / - Homepage', () => {
test("GET / - should load the homepage", async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});