import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Pricing, PricingSchema } from './pricing.schema';
import { Theater, TheaterSchema } from './theater.schema';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  userId: Types.ObjectId;

  @Prop({ default: true })
  status: boolean;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  startDateTime: Date;

  @Prop({ required: true })
  endDateTime: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: TheaterSchema, required: true })
  theater: Theater;

  @Prop({ required: true })
  categoryId: string;

  @Prop({ type: Types.ObjectId, ref: 'Organizers', required: true })
  organizerId: Types.ObjectId;

  @Prop({ type: [PricingSchema], required: true })
  pricing: Pricing[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
