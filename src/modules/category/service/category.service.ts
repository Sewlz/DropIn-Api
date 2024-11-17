import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../schema/category.schema';
import { Model } from 'mongoose';
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}
  async findAllCategory(): Promise<Category[]> {
    try {
      const categories: Category[] = await this.categoryModel.find().exec();
      return categories;
    } catch (error) {
      throw new Error(`Failed to get all category: ${error}`);
    }
  }
}
