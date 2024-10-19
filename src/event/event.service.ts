import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from 'src/schema/event.schema';
import { CreateEventDto } from './dto/create-event-dto';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}
  async findEventById(id: string): Promise<Event> {
    if (!id) {
      throw new Error('id is null or undefined');
    }
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return event;
  }
  async findEventByName(name: string): Promise<Event> {
    if (!name) {
      throw new Error('name is null or undefined');
    }
    try {
      const event = await this.eventModel.findOne({ name }).exec();
      if (!event) {
        throw new NotFoundException(`Item with name ${name} not found`);
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
}
