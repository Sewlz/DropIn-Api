import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Organizer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  organizerImg: number;

  @Prop({ required: true })
  description: string;
}

export const OrganizerSchema = SchemaFactory.createForClass(Organizer);
