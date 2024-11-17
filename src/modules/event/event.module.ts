import { Module } from '@nestjs/common';
import { EventService } from './service/event.service';
import { EventController } from './controller/event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'src/modules/event/schema/event.schema';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    ScheduleModule.forRoot(),
  ],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {}
