import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  eventDate: Date;

  @Prop({ required: true })
  eventTime: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'Theater', required: true })
  theaterId: Types.ObjectId;

  @Prop()
  categoryId: string;

  @Prop({ type: Types.ObjectId, ref: 'Organizer', required: true })
  organizerId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({
    type: [
      { ticketType: String, price: Number, currency: String, quantity: Number },
    ],
  })
  pricing: {
    ticketType: string;
    price: number;
    currency: string;
    quantity: number;
  }[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
