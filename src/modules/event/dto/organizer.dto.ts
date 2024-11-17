import { IsString, IsNotEmpty } from 'class-validator';

export class OrganizerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  organizerImg: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
