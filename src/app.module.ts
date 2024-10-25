import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizerModule } from './organizer/organizer.module';
import { TheaterModule } from './theater/theater.module';
import { BookingModule } from './booking/booking.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_HOST),
    EventModule,
    OrganizerModule,
    TheaterModule,
    BookingModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
