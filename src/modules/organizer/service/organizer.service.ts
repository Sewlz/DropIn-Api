import { Get, Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organizer } from '../schema/organizer.schema';
import { CreateOrganizerDto } from '../dto/create-organizer-dto';
@Injectable()
export class OrganizerService {
  constructor(
    @InjectModel(Organizer.name) private organizerModel: Model<Organizer>,
  ) {}
  async getAllOrganizer(): Promise<Organizer[]> {
    try {
      const organizer: Organizer[] = await this.organizerModel.find().exec();
      return organizer;
    } catch (error) {
      throw new Error(`Failed to get all organizer: ${error}`);
    }
  }
  async getOrganizerById(id: string): Promise<Organizer> {
    try {
      const organizer = await this.organizerModel.findById(id).exec();
      return organizer;
    } catch (error) {
      throw new Error(`Failed to get all organizer id: ${error}`);
    }
  }
  async createOrganizer(
    createOrganizerDto: CreateOrganizerDto,
  ): Promise<Organizer> {
    try {
      const createOrganizer = new this.organizerModel(createOrganizerDto);
      return createOrganizer.save();
    } catch (error) {
      throw new Error(`Failed to create organizer id: ${error}`);
    }
  }
}
