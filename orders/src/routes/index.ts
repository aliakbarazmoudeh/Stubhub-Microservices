import express, { Response, Request } from 'express';
import { BadRequestError, requireAuth } from '@middelwares-emamjs/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser?.id });
  if (!orders) {
    throw new BadRequestError('Not found');
  }
  res.status(200).json({ orders });
});

export { router as getAllOrders };
