import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Put,
  Req,
  Res,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { create } from 'domain';
import { CreateEventDto } from './dto/create-event-dto';
import { EventService } from './event.service';

//Controller will define path and https method
@Controller('event') // This sets the base path for all routes in this controller to "localhost/event"
export class EventController {
  constructor(private readonly eventService: EventService) {} // Inject the EventService to be used within this controller
  @Get(':id') // This route will match GET requests to "localhost/event/:id"
  async getEventById(@Param('id') id: string, @Res() res: Response) {
    try {
      const event = await this.eventService.findEventById(id); // Call the service to find the event by ID
      return res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: event,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: error.toString(),
      });
    }
  }

  @Get()
  async getEventByQuery(@Query('name') name: string, @Res() res: Response) {
    try {
      const event = await this.eventService.findEventByName(name);
      return res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: event,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: error.toString(),
      });
    }
  }

  @Post()
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @Res() res: Response,
  ) {
    try {
      await this.eventService.createEvent(createEventDto);
      const createEvent = await this.eventService.findEventByName(
        createEventDto.name,
      );
      return res
        .status(HttpStatus.OK)
        .json({ code: HttpStatus.OK, data: createEvent });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: error.toString(),
      });
    }
  }

  @Put(':id')
  updateEvent(@Body('id') updateEventDto: any) {
    return {
      updateEventDto,
    };
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.eventService.deleteEvent(id);
      return res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        msg: `Event With ${id} Deleted Successfully`,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: error.toString(),
      });
    }
  }
}
