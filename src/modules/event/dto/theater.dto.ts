import { IsString, IsNotEmpty } from 'class-validator';

export class TheaterDto {
  @IsString()
  @IsNotEmpty()
  theaterName: string;

  @IsString()
  @IsNotEmpty()
  theaterAddress: string;
}
