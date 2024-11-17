import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Put,
  Delete,
  UseGuards,
  Request,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event-dto';
import { EventService } from '../service/event.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { Role } from 'src/modules/auth/roles/enum/role.enum';
import { Roles } from 'src/modules/auth/roles/decorator/role.decorator';
import { UpdateEventDto } from '../dto/update-event-dto';
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('global')
  async getEventByQuery(@Query() query: ExpressQuery) {
    return this.eventService.findEvent(query);
  }

  @Get('global/:id')
  async getEventById(@Param('id') id: string) {
    return this.eventService.findEventById(id);
  }

  @UseGuards(AuthGuard)
  @Post('global')
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  @UseGuards(AuthGuard)
  @Get('user-events')
  async getUserEvent(@Request() req: any) {
    const userId = req.user.sub;
    return this.eventService.getUserEvent(userId);
  }

  @UseGuards(AuthGuard)
  @Delete('user-events/:eventId')
  async deleteEvent(@Param('eventId') eventId: string, @Request() req: any) {
    const userId = req.user.sub;
    await this.eventService.deleteEvent(userId, eventId);
  }

  @UseGuards(AuthGuard)
  @Put('user-events/:eventId')
  async updateEvent(
    @Body() updateEventDto: UpdateEventDto,
    @Param('eventId') eventId: string,
    @Request() req: any,
  ) {
    const userId = req.user.sub;
    return this.eventService.updateEvent(userId, eventId, updateEventDto);
  }
}
