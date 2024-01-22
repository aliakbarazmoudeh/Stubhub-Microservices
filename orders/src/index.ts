// import packages
import 'dotenv/config';
import 'express-async-errors';

import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

// connections
import mongoose from 'mongoose';
import { Ticket } from './models/ticketes';
import amqp from 'amqplib/callback_api';

// routes and controlleres
import { getAllOrders } from './routes';
import { createOrder } from './routes/new';
import { errorHandler, currentUser } from '@middelwares-emamjs/common';
import { NotFoundError } from '@middelwares-emamjs/common';
import { cancelOrder } from './routes/cancel';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, );

    console.log('Connected to MongoDb');
  } catch (err) {
    console.log('error from this block');
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
      channel.assertExchange('Order', 'topic', { durable: false });
      channel.assertExchange('Ticket', 'topic', {
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

          channel.bindQueue(q.queue, 'Ticket', 'Create');
          channel.consume(
            q.queue,
            async function (msg: any) {
              const { ticket } = JSON.parse(msg.content.toString());
              const { title, price, id } = ticket;

              const newTicket = Ticket.build({
                title,
                price,
                id,
              });
              await newTicket.save();
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
          channel.bindQueue(q.queue, 'Ticket', 'Update');
          channel.consume(
            q.queue,
            async (msg: any) => {
              const { ticket } = JSON.parse(msg.content.toString());
              const { title, price, id } = ticket;
              const oldTicket = await Ticket.findById(id);
              //@ts-ignore
              oldTicket.title = title;
              //@ts-ignore
              oldTicket.price = price;
              //@ts-ignore
              await oldTicket.save();
            },
            { noAck: true }
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
      app.use(getAllOrders);
      app.use(createOrder(channel));
      app.use(cancelOrder(channel));
      app.all('*', async (req, res) => {
        throw new NotFoundError();
      });
      app.use(errorHandler);
      app.listen(3000, () => {
        console.log('Orders service is listening on port 3000');
      });
    });
  });
};

start();
