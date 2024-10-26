import { Module } from '@nestjs/common';
import { EventService } from './service/event.service';
import { EventController } from './controller/event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'src/modules/event/schema/event.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
