import {
  BadRequestException,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { BookingService } from '../service/booking.service';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import {
  UseGuards,
  Get,
  Request,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common/decorators';
import { CreateBookingDto } from '../dto/create-booking-dto';
import { UpdateBookingDto } from '../dto/update-booking-dto';
import { Roles } from 'src/modules/auth/roles/decorator/role.decorator';
import { Role } from 'src/modules/auth/roles/enum/role.enum';
import { PaymentService } from 'src/modules/payment/service/payment.service';
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get('user')
  @UseGuards(AuthGuard)
  async getUserBooking(@Request() req: any) {
    const userId = req.user.sub;
    return this.bookingService.getAllUserBooking(userId);
  }

  @Get('admin')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  async getAllBooking() {
    return this.bookingService.getAllBooking();
  } //done

  @Post('user')
  @UseGuards(AuthGuard)
  async createUserBooking(
    @Request() req: any,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    const userId = req.user.sub;

    if (!userId) {
      throw new Error('User ID is missing');
    }

    if (!createBookingDto.totalAmount || !createBookingDto.ticketId) {
      throw new Error('Missing required booking data (totalAmount or event)');
    }

    createBookingDto.userId = userId;
    createBookingDto.bookingDate = new Date();

    const createdBooking =
      await this.bookingService.createUserBooking(createBookingDto);
    const paypalOrder = await this.paymentService.createOrder(
      createdBooking._id.toString(),
      createBookingDto.totalAmount,
    );

    return {
      code: 200,
      message: 'success',
      data: {
        bookingId: createdBooking._id,
        paypalOrder,
      },
    };
  } //done

  @Put('user/info/:id')
  @UseGuards(AuthGuard)
  async cancelUserBooking(@Param('id') bookingId: string, @Request() req: any) {
    try {
      const userId = req.user.sub;
      const booking = await this.bookingService.getBookingById(bookingId);
      this.bookingService.validateUserAccess(booking, userId);

      if (
        booking.paymentStatus === 'CANCELLED' ||
        booking.paymentStatus === 'REFUNDED'
      ) {
        return {
          statusCode: 400,
          message: 'This booking is already canceled or refunded.',
        };
      }

      const cancelPayment = await this.bookingService.cancelPayment(booking);
      return {
        statusCode: 200,
        message: 'Booking cancelled successfully',
        data: cancelPayment,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 400,
        message: error.message || 'Failed to cancel booking',
      };
    }
  } //sandbox not live

  @Put('admin/:id')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  async updateUserBooking(
    @Param('id') bookingId: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.updateBooking(bookingId, updateBookingDto);
  } //done

  @Delete('admin/:id')
  @UseGuards(AuthGuard)
  async deleteUserBooking(userId: string, @Param('id') bookingId: string) {
    return this.bookingService.deleteBooking(userId, bookingId);
  } //done
}
