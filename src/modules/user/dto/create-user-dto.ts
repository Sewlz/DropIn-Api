import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  // @IsEnum({ customer: 'customer', admin: 'admin', organizer: 'organizer' })
  // role?: 'customer' | 'admin' | 'organizer';
}
