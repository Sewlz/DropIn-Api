import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async getAllUser(): Promise<User[]> {
    try {
      const users: User[] = await this.userModel.find().exec();
      return users;
    } catch (error) {
      throw new Error(`Failed to get all user: ${error}`);
    }
  }
  async getUserByUserName(username: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ username }).exec();
      return user;
    } catch (error) {
      throw new Error(`Failed to get all user: ${error}`);
    }
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto) {
      throw new Error('createEventDto is null or undefined');
    }
    try {
      //hashing password wth bcrypt
      const salt = await bcrypt.genSalt();
      createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
      //create user
      const createUser = new this.userModel(createUserDto);
      return createUser.save();
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }
  async deleteUser(id: string) {
    if (!id) {
      throw new Error('id is null or undefined');
    }
    try {
      return this.userModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(`Failed to delete user: ${error}`);
    }
  }
}
