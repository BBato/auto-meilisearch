import { Model, model, Schema } from 'mongoose';

const SubscriberSchema = new Schema(
  {
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

let mongoose_model: Model<any>;
try {
  mongoose_model = model('subscriber');
} catch (error) {
  mongoose_model = model('subscriber', SubscriberSchema);
}

export const SubscriberMongooseModel = mongoose_model;
