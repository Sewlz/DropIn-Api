import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TheaterDocument = Theater & Document;

@Schema()
export class Theater {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: [{ seatId: String, seatType: String, status: String }] })
  seats: { seatId: string; seatType: string; status: string }[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TheaterSchema = SchemaFactory.createForClass(Theater);
