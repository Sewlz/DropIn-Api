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

class OrganizerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  organizerImg: number;

  @IsString()
  @IsNotEmpty()
  description: string;
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
  @Type(() => OrganizerDto)
  pricing: OrganizerDto[];
}
