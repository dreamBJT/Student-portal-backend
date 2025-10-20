import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Leader, LeaderDocument } from './schemas/leaders.schema';
@Injectable()
export class LeadersService {
  constructor(
    @InjectModel(Leader.name) private leaderModel: Model<LeaderDocument>,
  ) {}
  async create(data: Partial<Leader>): Promise<Leader> {
    const leader = new this.leaderModel(data);
    return leader.save();
  }
  async findAll(role?: string, department?: string): Promise<Leader[]> {
    const filter: any = {};
    if (role) filter.role = role;
    if (department) filter.department = department;

    return this.leaderModel.find(filter).sort({ createdAt: -1 }).exec();
  }
  async findOne(id: string): Promise<Leader> {
    const leader = await this.leaderModel.findById(id).exec();
    if (!leader) throw new NotFoundException('Leader not found');
    return leader;
  }
  async update(id: string, data: Partial<Leader>): Promise<Leader> {
    const updated = await this.leaderModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Leader not found');
    return updated;
  }
  async delete(id: string): Promise<void> {
    const result = await this.leaderModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Leader not found');
  }
}
