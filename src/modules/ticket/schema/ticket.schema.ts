import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket extends Document {
  _id: Types.ObjectId;

  @Prop({ required: true })
  ticketType: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 'VND' })
  currency: string;

  @Prop({ required: true })
  quantity: number;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
