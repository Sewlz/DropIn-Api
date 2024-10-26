import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event } from 'src/modules/event/schema/event.schema';
import { CreateEventDto } from '../dto/create-event-dto';
import { Query } from 'express-serve-static-core';
import { isString } from 'class-validator';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async findEvent(query: Query): Promise<Event[]> {
    if (!query) {
      throw new Error('event is null or undefined');
    }
    try {
      //pagination
      const resPerPage = Number(query.limit) || 5;
      const currentPage = Number(query.page) || 1;
      const skip = (currentPage - 1) * resPerPage;

      // Search criteria
      const searchCriteria: any = {};
      if (query.search && isString(query.search)) {
        const isValidObjId = Types.ObjectId.isValid(query.search);
        if (isValidObjId) {
          searchCriteria.$or = [
            { _id: new Types.ObjectId(query.search) },
            { userId: new Types.ObjectId(query.search) },
            { categoryId: new Types.ObjectId(query.search) },
            { organizerId: new Types.ObjectId(query.search) },
            { name: { $regex: query.search, $options: 'i' } },
            { 'theater.theaterName': { $regex: query.search, $options: 'i' } },
          ];
        } else {
          searchCriteria.$or = [
            { name: { $regex: query.search, $options: 'i' } },
            { 'theater.theaterName': { $regex: query.search, $options: 'i' } },
          ];
        }
      }

      const event = await this.eventModel
        .find({ ...searchCriteria })
        .limit(resPerPage)
        .skip(skip)
        .exec();

      if (!event) {
        return null;
      }
      return event;
    } catch (error) {
      throw new Error(`Failed to find event by name: ${error}`);
    }
  }

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    if (!createEventDto) {
      throw new Error('createEventDto is null or undefined');
    }
    try {
      const createdEvent = new this.eventModel(createEventDto);
      return createdEvent.save();
    } catch (error) {
      throw new Error(`Failed to create event: ${error}`);
    }
  }
  async deleteEvent(id: string) {
    if (!id) {
      throw new Error('Event id is null or undefined');
    }
    try {
      const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();
      return deletedEvent;
    } catch (error) {
      throw new Error(`Failed to delete event: ${error}`);
    }
  }
  async updateExpiredEvents(): Promise<void> {
    const currentTime = new Date();

    await this.eventModel.updateMany(
      { endDateTime: { $lt: currentTime }, status: true },
      { $set: { status: false } },
    );
  }
}
