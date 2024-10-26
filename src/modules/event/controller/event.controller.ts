import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event-dto';
import { EventService } from '../service/event.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getEventByQuery(@Query() query: ExpressQuery) {
    return this.eventService.findEvent(query);
  }

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  @Put(':id')
  async updateEvent(@Body('id') updateEventDto: any) {
    return {
      updateEventDto,
    };
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return this.eventService.deleteEvent(id);
  }
}
