import supertest from 'supertest';
import { guestAuth } from './util';
import { createApp } from '../src/main';

describe('Test user API', () => {
  describe('PATCH api/v1/user/me', () => {
    it('1', async () => {
      const app = await createApp();
      return guestAuth(app.getHttpServer()).then((res: supertest.Response) => {
        return supertest(app.getHttpServer())
          .patch('/api/v1/user/me')
          .set('authorization', `Bearer ${res.body.accessToken}`)
          .send({})
          .expect(200);
      });
    }, 50000);
  });
});
