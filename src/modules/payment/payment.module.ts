import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './service/payment.service';
import { PaymentController } from './controller/payment.controller';
import { BookingModule } from '../booking/booking.module';
@Module({
  imports: [forwardRef(() => BookingModule)],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
