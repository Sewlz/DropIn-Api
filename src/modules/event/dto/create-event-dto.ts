import {
  IsMongoId,
  IsString,
  IsDate,
  IsUrl,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TheaterDto } from './theater.dto';
import { OrganizerDto } from './organizer.dto';

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

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ValidateNested()
  @Type(() => TheaterDto)
  theater: TheaterDto;

  @ValidateNested()
  @Type(() => OrganizerDto)
  organizer: OrganizerDto;
}
