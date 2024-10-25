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
import { CreateEventDto } from './dto/create-event-dto';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get(':id')
  async getEventById(@Param('id') id: string) {
    return this.eventService.findEventById(id);
  }

  @Get()
  async getEventByQuery(@Query('name') name: string) {
    return this.eventService.findEventByName(name);
  }

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    const existingEvent = await this.eventService.findEventByName(
      createEventDto.name,
    );
    if (existingEvent) {
      throw new BadRequestException('An event with this name already exists.');
    }
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
