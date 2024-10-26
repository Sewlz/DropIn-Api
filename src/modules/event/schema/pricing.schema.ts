import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Pricing {
  @Prop({ required: true })
  ticketType: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  quantity: number;
}

export const PricingSchema = SchemaFactory.createForClass(Pricing);
