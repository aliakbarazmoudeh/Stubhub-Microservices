import mongoose, { Types } from 'mongoose';

interface OrderAttrs {
  userId: string;
  ticketId: string;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  ticketId: string;
  remove(): Promise<any>;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
    },
    ticketId: {
      type: Types.ObjectId,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
