import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganizerDocument = Organizer & Document;

@Schema({ timestamps: true })
export class Organizer {
  @Prop({ required: true })
  name: string;

  @Prop()
  logoUrl: string;

  @Prop({ type: { phone: String, email: String } })
  contactDetails: { phone: string; email: string };
}

export const OrganizerSchema = SchemaFactory.createForClass(Organizer);
