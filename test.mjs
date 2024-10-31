import request from 'supertest'
import app from './app.js'

test("Hello world!", (t) =>{
    t.pass();
})

test("GET / - should load the homepage", async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });