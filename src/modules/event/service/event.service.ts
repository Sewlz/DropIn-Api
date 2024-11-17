import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event } from 'src/modules/event/schema/event.schema';
import { CreateEventDto } from '../dto/create-event-dto';
import { Query } from 'express-serve-static-core';
import { isString } from 'class-validator';
import { UpdateEventDto } from '../dto/update-event-dto';
import { Cron, CronExpression } from '@nestjs/schedule';

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

  async findEventById(id: string): Promise<Event> {
    try {
      return this.eventModel.findById(id).exec();
    } catch (error) {
      throw new Error(`Failed to get Event: ${error}`);
    }
  }

  async getUserEvent(id: string): Promise<Event[]> {
    try {
      const objectId = new Types.ObjectId(id);
      const events: Event[] = await this.eventModel
        .find({ userId: objectId })
        .exec();
      return events;
    } catch (error) {
      throw new Error(`Failed to get Event: ${error}`);
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
  async deleteEvent(userId: string, eventId: string) {
    if (!userId || !eventId) {
      throw new Error('Event id is null or undefined');
    }
    try {
      const formattedEventId = new Types.ObjectId(eventId);
      const formattedUserId = new Types.ObjectId(userId);
      const deletedEvent = await this.eventModel
        .findOneAndDelete({
          _id: formattedEventId,
          userId: formattedUserId,
        })
        .exec();
      return deletedEvent;
    } catch (error) {
      throw new Error(`Failed to delete event: ${error}`);
    }
  }
  async deleteEventByUserId(userId: string) {
    try {
      const formattedUserId = new Types.ObjectId(userId);
      const deletedEvent = await this.eventModel
        .deleteMany({ userId: formattedUserId })
        .exec();
      return deletedEvent;
    } catch (error) {
      throw new Error(`Failed to delete event: ${error}`);
    }
  }
  async updateEvent(
    userId: string,
    eventId: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    try {
      const formattedEventId = new Types.ObjectId(eventId);
      const formattedUserId = new Types.ObjectId(userId);
      const event = await this.eventModel.findOneAndUpdate(
        { _id: formattedEventId, userId: formattedUserId },
        { $set: updateEventDto },
        { new: true },
      );
      if (!event) {
        throw new NotFoundException(
          'Event not found or you do not have permission to update it',
        );
      }
      return event;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new Error(`Failed to update event: ${error.message}`);
      }
    }
  }

  async updateExpiredEvents(): Promise<void> {
    const currentTime = new Date();

    await this.eventModel.updateMany(
      { endDateTime: { $lt: currentTime }, status: true },
      { $set: { status: false } },
    );

    console.log('Expired events updated at', currentTime);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    await this.updateExpiredEvents();
  }
}
