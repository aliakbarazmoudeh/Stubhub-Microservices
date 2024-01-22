import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { requireAuth, validateRequest } from '@middelwares-emamjs/common';
import mongoose from 'mongoose';
const router = express.Router();

const createTicketRouter = (channel: any) => {
  return router.post(
    '/api/tickets',
    requireAuth,
    [
      body('title').not().isEmpty().withMessage('invalid title'),
      body('price').isFloat({ gt: 0 }).withMessage('invalid price provided'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { title, price } = req.body;
      const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id,
      });
      await ticket.save();
      channel.publish(
        'Ticket',
        'Create',
        Buffer.from(JSON.stringify({ ticket }))
      );
      res.status(201).json({ ticket });
    }
  );
};

export { createTicketRouter };
