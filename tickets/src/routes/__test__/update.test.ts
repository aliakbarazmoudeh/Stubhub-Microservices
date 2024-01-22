import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { createTicket } from './index.test';

const id = new mongoose.Types.ObjectId().toHexString();

it('returns a 404 if the provided id does not exist', async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'rock', price: 100 })
    .set('Cookie', global.signin())
    .expect(404);
});

it('returns 401 if the user is not authenticated', async () => {
  await request(app).put(`/api/tickets/${id}`).send().expect(401);
});

it('returns a 401 if the user does not own the ticket ', async () => {
  const response = await createTicket();

  const ticketres = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'phonk', price: 50 })
    .expect(401);
});

it('returns a 400 if the use provided an invalid title or price', async () => {
  const response = await createTicket();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: '', price: 50 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'phonk', price: -50 })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'phonk', price: 50 });


  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'rock', price: 70 })
    .expect(200);
});
