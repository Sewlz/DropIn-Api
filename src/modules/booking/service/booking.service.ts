import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { Model, Types } from 'mongoose';
import { Booking } from '../schema/booking.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBookingDto } from '../dto/create-booking-dto';
import { UpdateBookingDto } from '../dto/update-booking-dto';
import { PaymentService } from 'src/modules/payment/service/payment.service';
import { Ticket } from 'src/modules/ticket/schema/ticket.schema';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    private readonly paymentService: PaymentService,
  ) {}

  async getAllUserBooking(userId: string): Promise<Booking[]> {
    try {
      const bookings: Booking[] = await this.bookingModel
        .find({ userId: userId })
        .exec();
      return bookings;
    } catch (error) {
      throw new Error(`Failed to get all user booking ${error}`);
    }
  }

  async getAllBooking(): Promise<Booking[]> {
    try {
      const bookings: Booking[] = await this.bookingModel.find().exec();
      return bookings;
    } catch (error) {
      throw new Error(`Failed to get all booking ${error}`);
    }
  }

  async getBookingById(id: string): Promise<Booking> {
    try {
      const formattedId = new Types.ObjectId(id);
      const booking: Booking = await this.bookingModel.findById(formattedId);
      return booking;
    } catch (error) {
      throw new Error(`Failed to get booking by id ${error}`);
    }
  }

  async createUserBooking(
    createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    if (!createBookingDto) {
      throw new Error('createBookingDto is null or undefined');
    }
    try {
      const createdBooking = new this.bookingModel(createBookingDto);
      return createdBooking.save();
    } catch (error) {
      throw new Error(`Failed to create user booking ${error}`);
    }
  }
  async capturePayment(bookingId: string, token: string) {
    try {
      const captureResult = await this.paymentService.captureOrder(token);
      const formattedBookingId = new Types.ObjectId(bookingId);
      const price = parseFloat(
        captureResult.purchase_units[0].payments.captures[0].amount.value,
      );

      if (captureResult.status === 'COMPLETED') {
        await this.bookingModel.findByIdAndUpdate(formattedBookingId, {
          totalPrice: price,
          paymentStatus: 'COMPLETED',
          capturedId: captureResult.id,
        });
        return { status: 'success', captureResult };
      } else {
        await this.bookingModel.findByIdAndUpdate(formattedBookingId, {
          paymentStatus: 'FAILED',
        });
        return { status: 'failed', captureResult };
      }
    } catch (error) {
      throw new Error(`Payment capture failed: ${error.message}`);
    }
  }

  async cancelPayment(booking: Booking, ticket: Ticket) {
    if (booking.paymentStatus === 'CANCELLED') {
      throw new Error('Booking is already cancelled');
    }

    if (!booking.capturedId) {
      throw new Error('Invalid payment capture ID');
    }

    if (booking.paymentStatus === 'REFUNDED') {
      throw new Error('Payment has already been refunded');
    }

    try {
      const refund = await this.paymentService.refundPayment(
        booking.capturedId,
        ticket.price * booking.quantity,
      );

      if (refund.status === 'COMPLETED') {
        await this.bookingModel.findByIdAndUpdate(booking._id, {
          paymentStatus: 'CANCELLED',
          refundStatus: 'REFUNDED',
        });
        return { status: 'success', refund };
      } else {
        return { status: 'failed', refund };
      }
    } catch (error) {
      throw new Error(`Failed to refund payment: ${error.message}`);
    }
  }

  async updateBooking(
    bookingId: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    if (!updateBookingDto) {
      throw new Error('updateBookingDto is null or undefined');
    }
    try {
      const formattedBookingId = new Types.ObjectId(bookingId);
      const updatedBooking = this.bookingModel.findOneAndUpdate(
        { _id: formattedBookingId },
        { $set: updateBookingDto },
        { new: true },
      );
      if (!updatedBooking) {
        throw new NotFoundException(
          'Booking not found or you do not have permission to update it',
        );
      }
      return updatedBooking;
    } catch (error) {
      throw new Error(`Failed to update user booking ${error}`);
    }
  }

  async deleteBooking(userId: string, bookingId: string): Promise<Booking> {
    try {
      // const formmatedUserId = new Types.ObjectId(userId);
      const formattedBookingId = new Types.ObjectId(bookingId);
      return this.bookingModel
        .findOneAndDelete({
          _id: formattedBookingId,
          // userId: formmatedUserId,
        })
        .exec();
    } catch (error) {
      throw new Error(`Failed to delete user booking ${error}`);
    }
  }

  async deleteBookingByUserId(userId: string) {
    try {
      const formmatedUserId = new Types.ObjectId(userId);
      const deletedBooking = await this.bookingModel
        .deleteMany({ userId: formmatedUserId })
        .exec();
      return deletedBooking;
    } catch (error) {
      throw new Error(`Failed to delete user booking ${error}`);
    }
  }

  async validateUserAccess(booking: Booking, userId: string) {
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.userId.toString() !== userId) {
      throw new BadRequestException(
        'You are not authorized to cancel this booking',
      );
    }
    if (booking.paymentStatus === 'CANCELLED') {
      throw new BadRequestException('Booking is already cancelled');
    }
  }
}
