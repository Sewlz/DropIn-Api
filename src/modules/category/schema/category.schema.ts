import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Category {
  _id: Types.ObjectId;
  @Prop({ required: true })
  categoryName: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
