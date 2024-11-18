import {
  IsString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class TicketDto {
  @IsString()
  @IsOptional()
  ticketType: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsNumber()
  @IsOptional()
  quantity: number;

  @IsOptional()
  @IsMongoId()
  eventId?: string;
}
