import { IsString, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class TicketDto {
  @IsMongoId()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  ticketType: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
