import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async createUser(userData: Partial<User>): Promise<UserDocument> {
    console.log('Creating user with data:', userData);
    const createdUser = new this.userModel(userData);
    try {
      const savedUser = await createdUser.save();
      console.log('User created successfully:', savedUser);
      return savedUser;
    } catch (error) {
      console.error('Error creating user:', error.message, error);
      throw error;
    }
  }

  async update(id: string, updateData: Partial<User>): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async createSampleUsers() {
    const sampleUsers = [
      {
        username: 'student1',
        password: 'password123',
        email: 'student1@example.com',
        image: 'https://example.com/student1.jpg',
        role: 'students',
      },
      {
        username: 'admin1',
        password: 'password123',
        email: 'admin1@example.com',
        image: 'https://example.com/admin1.jpg',
        role: 'admin',
      },
      {
        username: 'superadmin1',
        password: 'password123',
        email: 'superadmin1@example.com',
        image: 'https://example.com/superadmin1.jpg',
        role: 'superAdmin',
      },
      {
        username: 'student2',
        password: 'password123',
        email: 'student2@example.com',
        image: 'https://example.com/student2.jpg',
        role: 'students',
      },
    ];

    for (const userData of sampleUsers) {
      try {
        const createdUser = await this.createUser(userData);
        console.log(`User ${userData.username} created successfully:`, createdUser);
      } catch (error) {
        console.error(`Error creating user ${userData.username}:`, error.message, error);
      }
    }
  }
}
