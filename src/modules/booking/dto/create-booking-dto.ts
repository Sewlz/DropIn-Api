import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';

export class CreateBookingDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsNotEmpty()
  @IsMongoId()
  ticketId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsDate()
  bookingDate?: Date;
}
