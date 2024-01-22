import mongoose from 'mongoose';
import amqp from 'amqplib/callback_api';
import express from 'express';
import 'dotenv/config';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';

import { errorHandler, currentUser } from '@middelwares-emamjs/common';
import { NotFoundError } from '@middelwares-emamjs/common';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';
import { Ticket } from './models/ticket';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI,);

    console.log('Connected to MongoDb');
  } catch (err) {
    console.log(process.env.MONGO_URI);
    console.error(err);
  }

  amqp.connect('amqp://rabbitmq', (error0: any, connection: any) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1: any, channel: any) => {
      if (error1) {
        throw error1;
      }

      channel.assertExchange('Ticket', 'topic', {
        durable: false,
      });
      channel.assertExchange('Order', 'topic', {
        durable: false,
      });
      channel.assertQueue(
        '',
        {
          exclusive: true,
        },
        function (error2: any, q: any) {
          if (error2) {
            throw error2;
          }

          channel.bindQueue(q.queue, 'Order', 'Create');
          channel.consume(
            q.queue,
            async function (msg: any) {
              const { order } = JSON.parse(msg.content.toString());
              const { ticketId, id } = order;
              const ticket = await Ticket.findById(ticketId);
              ticket!.orderId = id;
              await ticket!.save();
            },
            {
              noAck: true,
            }
          );
        }
      );
      channel.assertQueue(
        '',
        {
          exclusive: true,
        },
        function (error2: any, q: any) {
          if (error2) {
            throw error2;
          }

          channel.bindQueue(q.queue, 'Order', 'Cancel');
          channel.consume(
            q.queue,
            async function (msg: any) {
              const { order } = JSON.parse(msg.content.toString());
              const { ticketId } = order;
              const ticket = await Ticket.findById(ticketId);
              ticket!.orderId = undefined;
              await ticket!.save();
            },
            {
              noAck: true,
            }
          );
        }
      );

      const app = express();
      app.set('trust proxy', true);
      app.use(json());
      app.use(
        cookieSession({
          signed: false,
          // secure: process.env.NODE_ENV !== 'test',
        })
      );
      app.use(currentUser);
      app.use(createTicketRouter(channel));
      app.use(showTicketRouter);
      app.use(indexTicketRouter);
      app.use(updateTicketRouter(channel));
      app.all('*', async (req, res) => {
        throw new NotFoundError();
      });
      app.use(errorHandler);
      app.listen(3000, () => {
        console.log('ticket is listening on port 3000');
      });
    });
  });
};

start();
