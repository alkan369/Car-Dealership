import request from 'supertest';
import {describe, expect, test} from '@jest/globals';
import { app, listenServer } from '../index';

describe('Test App', () => {
  const testApp = app;
  
  test("Check base Hello World! valid endpoint", async () => {
      const response = await request(testApp).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Hello World!' });
  });

  test("Check base invalid endpoint", async () => {
      const response = await request(testApp).get('/invalid');
      expect(response.status).toBe(404);
  });

  afterAll((done) => {
    listenServer.close(done)
  });
});


