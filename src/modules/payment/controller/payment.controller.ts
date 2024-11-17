import { Controller, Post, Body, Param, Put, Query } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { BookingService } from '../../booking/service/booking.service';
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paypalService: PaymentService,
    private readonly bookingService: BookingService,
  ) {}
  @Put('result')
  async handlePaymentResult(
    @Query() query: { token: string; bookingId: string },
  ) {
    const { token, bookingId } = query;
    if (!token || !bookingId) {
      throw new Error('Missing required query parameters');
    }
    const captureResult = await this.bookingService.capturePayment(
      bookingId,
      token,
    );
    if (captureResult.status === 'success') {
      return { message: 'Payment completed successfully', captureResult };
    } else {
      return { message: 'Payment failed', captureResult };
    }
  }
}
