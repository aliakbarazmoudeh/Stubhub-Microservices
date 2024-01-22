import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import amqp, { Channel, Connection } from 'amqplib/callback_api';
import { Password } from '../services/password';
import { User } from '../models/User';
import { NotFoundError, validateRequest } from '@middelwares-emamjs/common';
import { BadRequestError } from '@middelwares-emamjs/common';
const router = express.Router();

const signinRouter = (channel: any) => {
  return router.post(
    '/api/users/signin',
    [
      body('email').isEmail().withMessage('Email must be valid'),
      body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new NotFoundError();
      }
      const passwordsMatch = await Password.compare(
        existingUser.password,
        password
      );
      if (!passwordsMatch) {
        throw new BadRequestError('Invalid Credentials');
      }

      const userJwt = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
        },
        process.env.JWT_KEY!
      );

      req.session = {
        jwt: userJwt,
      };
      channel.assertQueue('auth', { durable: false });
      channel.sendToQueue(
        'auth',
        Buffer.from('I am Emam.js from signin with test functionality')
      );
      res.status(200).send('I am Emam.js');
    }
  );
};
export { signinRouter };
