import { Module } from '@nestjs/common';
import { BookingService } from './service/booking.service';
import { BookingController } from './controller/booking.controller';

@Module({
  providers: [BookingService],
  controllers: [BookingController]
})
export class BookingModule {}
