import { Module } from '@nestjs/common';
import { TheaterService } from './theater.service';
import { TheaterController } from './theater.controller';

@Module({
  providers: [TheaterService],
  controllers: [TheaterController]
})
export class TheaterModule {}
