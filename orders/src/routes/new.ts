import express, { Response, Request } from 'express';
import { BadRequestError, requireAuth } from '@middelwares-emamjs/common';
import { Order } from '../models/order';
import { Ticket } from '../models/ticketes';

const router = express.Router();

const createOrder = (channel: any) => {
  return router.post(
    '/api/orders',
    requireAuth,
    async (req: Request, res: Response) => {
      const { ticketId } = req.body;
      const isReserved = await Order.findOne({ ticketId });
      if (isReserved) {
        throw new BadRequestError('sorry, ticket already reserved');
      }
      const order = await Order.build({
        ticketId,
        userId: req.currentUser!.id,
      });
      await order.save();
      channel.publish(
        'Order',
        'Create',
        Buffer.from(JSON.stringify({ order }))
      );
      res.status(200).json({ order });
    }
  );
};

export { createOrder };
