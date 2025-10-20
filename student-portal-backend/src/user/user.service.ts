import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(
    userData: Partial<User>,
    createdByRole: string = 'students',
  ): Promise<User> {
    // Prevent creating a superAdmin unless creator is superAdmin
    if (userData.role === 'superAdmin' && createdByRole !== 'superAdmin') {
      throw new ForbiddenException(
        'Only a superAdmin can create another superAdmin',
      );
    }

    // Default role if not provided
    if (!userData.role) {
      userData.role = 'students';
    }

    const user = new this.userModel(userData);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async update(
    id: string,
    updateData: Partial<User>,
    updaterRole: string = 'students',
  ): Promise<User | null> {
    // Prevent elevating to superAdmin unless updater is superAdmin
    if (updateData.role === 'superAdmin' && updaterRole !== 'superAdmin') {
      throw new ForbiddenException(
        'Only a superAdmin can assign superAdmin role',
      );
    }

    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
