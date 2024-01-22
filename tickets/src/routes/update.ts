import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import {
  NotFoundError,
  validateRequest,
  NotAuthorizedError,
  requireAuth,
} from '@middelwares-emamjs/common';
import { body } from 'express-validator';
const router = express.Router();

const updateTicketRouter = (channel: any) => {
  return router.put(
    '/api/tickets/:id',
    requireAuth,
    [
      body('title').not().isEmpty().withMessage('invalid title is provided'),
      body('price').isFloat({ gt: 0 }).withMessage('invalid price is provided'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) {
        throw new NotFoundError();
      }
      if (req.currentUser?.id != ticket.userId) {
        throw new NotAuthorizedError();
      }
      const { title, price } = req.body;
      if (title) ticket.title = title;
      if (price) ticket.price = price;
      await ticket.save();
      channel.publish(
        'Ticket',
        'Update',
        Buffer.from(JSON.stringify({ ticket }))
      );
      res.send(ticket);
    }
  );
};

export { updateTicketRouter };
