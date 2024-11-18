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
  ticketId?: string;

  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsDate()
  bookingDate?: Date;
}
