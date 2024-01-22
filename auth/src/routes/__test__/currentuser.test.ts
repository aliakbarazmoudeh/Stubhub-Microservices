import request from 'supertest';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';

it('showing current user', async () => {
  const authResponse = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .set('Accept', 'application/json')
    .expect(StatusCodes.CREATED);
  const cookie = authResponse.get('Set-Cookie');
  await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .expect(StatusCodes.OK);
});
