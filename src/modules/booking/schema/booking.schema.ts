import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  event: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [{ seatNumber: String, ticketType: String }] })
  seats: { seatNumber: string; ticketType: string }[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 'pending' })
  paymentStatus: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
