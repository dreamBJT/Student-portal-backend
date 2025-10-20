import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Election, ElectionDocument } from './schemas/elections.schema';
@Injectable()
export class ElectionsService {
  constructor(
    @InjectModel(Election.name) private electionModel: Model<ElectionDocument>,
  ) {}
  async create(data: Partial<Election>): Promise<Election> {
    const election = new this.electionModel(data);
    return election.save();
  }
  async findAll(): Promise<Election[]> {
    return this.electionModel.find().sort({ startDate: -1 }).exec();
  }

  async findOne(id: string): Promise<Election> {
    const election = await this.electionModel.findById(id).exec();
    if (!election) throw new NotFoundException('Election not found');
    return election;
  }
  async update(id: string, data: Partial<Election>): Promise<Election> {
    const updated = await this.electionModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Election not found');
    return updated;
  }
  async delete(id: string): Promise<void> {
    const result = await this.electionModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Election not found');
  }
}
