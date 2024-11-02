import {
  Controller,
  Post,
  Get,
  Body,
  Delete,
  Put,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user-dto';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { Role } from 'src/modules/auth/roles/enum/role.enum';
import { Roles } from 'src/modules/auth/roles/decorator/role.decorator';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Get('all')
  async getAllUser() {
    return this.userService.getAllUser();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  @Delete()
  async deleteUser(@Request() req: any) {
    const userId = req.user.sub;
    return this.userService.deleteUser(userId);
  }
}
