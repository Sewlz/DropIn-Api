import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Ticket', required: true })
  ticketId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: 0 })
  totalPrice: number;

  @Prop({ default: 'PENDING' })
  paymentStatus: string;

  @Prop({ default: '' })
  capturedId: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
