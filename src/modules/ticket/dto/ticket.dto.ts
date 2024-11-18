import { IsString, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class TicketDto {
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
