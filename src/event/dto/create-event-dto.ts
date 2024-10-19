import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsUrl,
  IsMongoId,
  IsObject,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  image: string;

  @IsMongoId()
  @IsNotEmpty()
  theaterId: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsObject()
  @IsNotEmpty()
  pricing: Map<string, number>;

  @IsObject()
  @IsNotEmpty()
  organizer: {
    organizerId: string;
    name: string;
  };
}
