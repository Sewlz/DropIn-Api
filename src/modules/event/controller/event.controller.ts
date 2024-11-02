import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Put,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event-dto';
import { EventService } from '../service/event.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { Role } from 'src/modules/auth/roles/enum/role.enum';
import { Roles } from 'src/modules/auth/roles/decorator/role.decorator';
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  @UseGuards(AuthGuard)
  @Roles(Role.Customer)
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
