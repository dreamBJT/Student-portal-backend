import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Candidate, CandidateDocument } from './candidate.schema';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(Candidate.name)
    private candidateModel: Model<CandidateDocument>,
  ) {}

  async create(
    candidateData: Partial<Candidate>,
    creatorRole: string,
    creatorId: string,
  ): Promise<Candidate> {
    if (creatorRole !== 'admin' && creatorRole !== 'superAdmin') {
      throw new ForbiddenException('Only admins can create candidates');
    }

    const candidate = new this.candidateModel({
      ...candidateData,
      createdBy: creatorId,
    });
    return candidate.save();
  }

  async findAll(): Promise<Candidate[]> {
    return this.candidateModel.find().exec();
  }

  async findById(id: string): Promise<Candidate | null> {
    return this.candidateModel.findById(id).exec();
  }

  async updateStatus(
    id: string,
    status: 'Pending' | 'Approved' | 'Rejected',
  ): Promise<Candidate | null> {
    return this.candidateModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Candidate | null> {
    return this.candidateModel.findByIdAndDelete(id).exec();
  }
}
