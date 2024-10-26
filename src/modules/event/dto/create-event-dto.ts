import {
  IsString,
  IsDate,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsNumber,
  IsUrl,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

class PricingDto {
  @IsString()
  @IsNotEmpty()
  ticketType: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  quantity: number;
}

class TheaterDto {
  @IsString()
  @IsNotEmpty()
  theaterName: string;

  @IsString()
  @IsNotEmpty()
  theaterAddress: string;
}

export class CreateEventDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDate()
  @Type(() => Date)
  startDateTime: Date;

  @IsDate()
  @Type(() => Date)
  endDateTime: Date;

  @IsString()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @ValidateNested()
  @Type(() => TheaterDto)
  theater: TheaterDto;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsMongoId()
  @IsNotEmpty()
  organizerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PricingDto)
  pricing: PricingDto[];
}
