import { Module } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { OrganizerController } from './organizer.controller';
import { MongooseModule } from '@nestjs/mongoose';
// import {} from '../schema/organizer.schema'
@Module({
  // imports:[MongooseModule.forFeature([{name:}])]
  providers: [OrganizerService],
  controllers: [OrganizerController]
})
export class OrganizerModule {}
