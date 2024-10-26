export class CreateUserDto {
  username: string;
  email: string;
  passwordHash: string;
  role?: 'customer' | 'admin' | 'organizer';
}
