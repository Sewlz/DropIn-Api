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
  Query,
} from '@nestjs/common/decorators';
import { CreateBookingDto } from '../dto/create-booking-dto';
import { UpdateBookingDto } from '../dto/update-booking-dto';
import { Roles } from 'src/modules/auth/roles/decorator/role.decorator';
import { Role } from 'src/modules/auth/roles/enum/role.enum';
import { PaymentService } from 'src/modules/payment/service/payment.service';
import { TicketService } from 'src/modules/ticket/service/ticket.service';
import { Types } from 'mongoose';
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly ticketService: TicketService,
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
  }

  @Post('user/:ticketId')
  @UseGuards(AuthGuard)
  async createUserBooking(
    @Request() req: any,
    @Param('ticketId') ticketId: string,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    const userId = req.user.sub;
    const ticket = await this.ticketService.getTicketById(ticketId);

    if (!userId) {
      throw new Error('User ID is missing');
    }
    if (!ticket.price || !ticketId) {
      throw new Error('Missing required booking data (totalAmount or ticket)');
    }

    createBookingDto.ticketId = ticket._id.toString();
    createBookingDto.userId = userId;
    createBookingDto.bookingDate = new Date();
    
    const createdBooking =
      await this.bookingService.createUserBooking(createBookingDto);

    const totalPrice = createdBooking.quantity * ticket.price;
    const paypalOrder = await this.paymentService.createOrder(
      createdBooking._id.toString(),
      totalPrice,
    );

    return {
      code: 200,
      message: 'success',
      data: {
        bookingId: createdBooking._id,
        paypalOrder,
      },
    };
  }

  @Put('user/info')
  @UseGuards(AuthGuard)
  async cancelUserBooking(
    @Query() query: { bookingId: string; ticketId: string },
    @Request() req: any,
  ) {
    try {
      const userId = req.user.sub;
      const booking = await this.bookingService.getBookingById(query.bookingId);
      const ticket = await this.ticketService.getTicketById(query.ticketId);

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

      const cancelPayment = await this.bookingService.cancelPayment(
        booking,
        ticket,
      );
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
  }

  @Put('admin/:id')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  async updateUserBooking(
    @Param('id') bookingId: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.updateBooking(bookingId, updateBookingDto);
  }

  @Delete('admin/:id')
  @UseGuards(AuthGuard)
  async deleteUserBooking(userId: string, @Param('id') bookingId: string) {
    return this.bookingService.deleteBooking(userId, bookingId);
  }
}
