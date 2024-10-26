import { Module } from '@nestjs/common';
import { OrganizerService } from './service/organizer.service';
import { OrganizerController } from './controller/organizer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Organizer, OrganizerSchema } from './schema/organizer.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organizer.name, schema: OrganizerSchema },
    ]),
  ],
  providers: [OrganizerService],
  controllers: [OrganizerController],
})
export class OrganizerModule {}
