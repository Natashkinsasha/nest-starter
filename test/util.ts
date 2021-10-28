import { ObjectId } from 'bson';
import supertest = require('supertest');
import { UpdateModel } from 'repository-generic';
import User from '../src/model/User';
import { NestExpressApplication } from '@nestjs/platform-express';

export function guestAuth(
  app: NestExpressApplication,
  user?: UpdateModel<User>,
) {
  return supertest(app)
    .post('/api/v1/auth/guest')
    .send({})
    .expect(201)
    .then(async (res) => {
      if (user) {
        const { body } = await supertest(app)
          .patch('/api/v1/user/me/force')
          .set('authorization', `Bearer ${res.body.accessToken}`)
          .send(user)
          .expect(200);
        return { ...res, boby: { ...res.body, user: body.user } };
      }
      return res;
    });
}
