import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async create(userData: Partial<User>): Promise<UserDocument> {
    if (userData.password) {
      const salt = await bcrypt.genSalt();
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async verifyHospital(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, { isVerified: true }, { new: true }).exec();
  }

  async updateAvailability(id: string, availability: boolean): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, { availability }, { new: true }).exec();
  }

  async findAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async remove(id: string): Promise<any> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
