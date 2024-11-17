import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Organizer, OrganizerSchema } from './organizer.schema';
import { Theater, TheaterSchema } from './theater.schema';
import { Ticket, TicketSchema } from './ticket.schema';

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

  @Prop({ type: OrganizerSchema, required: true })
  organizer: Organizer;

  @Prop({ type: TicketSchema, required: true })
  ticket: Ticket;
}

export const EventSchema = SchemaFactory.createForClass(Event);
