import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Theater {
  @Prop({ required: true })
  theaterName: string;

  @Prop({ required: true })
  theaterAddress: string;
}

export const TheaterSchema = SchemaFactory.createForClass(Theater);
