const request = require('supertest');
const app = require('../app'); // assuming your app is exported from app.js

describe("Express Calculator Routes", () => {

  test("GET /mean with valid numbers", async () => {
    const response = await request(app).get('/mean?nums=1,2,3,4,5');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ operation: "mean", value: 3 });
  });

  test("GET /mean with invalid input", async () => {
    const response = await request(app).get('/mean?nums=1,foo,3');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "foo is not a number." });
  });

  test("GET /median with valid numbers", async () => {
    const response = await request(app).get('/median?nums=1,2,3,4,5');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ operation: "median", value: 3 });
  });

  test("GET /mode with valid numbers", async () => {
    const response = await request(app).get('/mode?nums=1,2,2,3,3,3,4,4');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ operation: "mode", value: [3] });
  });

  test("GET /all with valid numbers", async () => {
    const response = await request(app).get('/all?nums=1,2,2,3,4');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      operation: "all",
      mean: 2.4,
      median: 2,
      mode: [2]
    });
  });

  test("GET /mean without nums", async () => {
    const response = await request(app).get('/mean');
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "nums are required." });
  });

});

