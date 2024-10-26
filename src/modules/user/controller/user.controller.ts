import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  Put,
  Param,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user-dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getAllUser() {
    return this.userService.getAllUser();
  }
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
  @Delete(':id')
  async deleteUser(@Param() id: string) {
    return this.userService.deleteUser(id);
  }
}
