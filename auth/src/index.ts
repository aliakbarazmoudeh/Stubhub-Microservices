import 'express-async-errors';
import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signIn';
import { signoutRouter } from './routes/signOut';
import { signupRouter } from './routes/signUp';
import { errorHandler } from '@middelwares-emamjs/common';
import { NotFoundError } from '@middelwares-emamjs/common';
import amqp from 'amqplib/callback_api';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDb');
  } catch (err) {
    console.log('error is from this block');
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
      channel.assertQueue('auth', { durable: false });
      const app = express();
      app.set('trust proxy', true);
      app.use(json());
      app.use(
        cookieSession({
          signed: false,
          // secure: process.env.NODE_ENV !== 'test',
        })
      );

      app.use(currentUserRouter);
      app.use(signinRouter(channel));
      app.use(signoutRouter);
      app.use(signupRouter);

      app.all('*', async (req, res) => {
        throw new NotFoundError();
      });

      app.use(errorHandler);
      app.listen(3000, () => {
        console.log('auth is listening on port 3000');
      });
    });
  });
};

start();


