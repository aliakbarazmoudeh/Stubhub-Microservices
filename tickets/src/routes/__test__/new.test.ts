import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('has route handler listening to /api/tickets for post request', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user signed in', async () => {
  
  return request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user signed in', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({});
  expect(response.status).not.toEqual(401);
});

it('return an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('return an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'boot',
      price: -10,
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'boot',
    })
    .expect(400);
});

it('create a ticket with a valid inputs ', async () => {
  let ticket = await Ticket.find({});
  expect(ticket.length).toEqual(0);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'boot', price: 50 })
    .expect(201);
  ticket = await Ticket.find({});
  expect(ticket.length).toEqual(1);
});
