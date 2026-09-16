import request from 'supertest';
import app from '../gateway/index.js';

describe('Gateway server', () => {
  it('GET / returns a welcome message', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Hello from the Gateway server!');
  });
});
