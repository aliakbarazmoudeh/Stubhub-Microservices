import express, { Response, Request } from 'express';
import { BadRequestError, requireAuth } from '@middelwares-emamjs/common';
import { Order } from '../models/order';
import { Ticket } from '../models/ticketes';

const router = express.Router();

const cancelOrder = (channel: any) => {
  return router.delete(
    '/api/orders/:id',
    requireAuth,
    async (req: Request, res: Response) => {
      const { id } = req.params;

      const currentUserId = req.currentUser?.id;
      const order = await Order.findOne({ _id: id });

      if (order!.userId != currentUserId) {
        throw new BadRequestError('invalid credentianl');
      }
      channel.publish(
        'Order',
        'Cancel',
        Buffer.from(JSON.stringify({ order }))
      );
      await Order.findByIdAndDelete(id);
      res.status(200).json({ order });
    }
  );
};

export { cancelOrder };
