import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vote, VoteDocument } from './vote.schema';

@Injectable()
export class VotesService {
  constructor(@InjectModel(Vote.name) private voteModel: Model<VoteDocument>) {}

  // Cast a vote
  async castVote(voterId: string, candidateId: string): Promise<Vote> {
    // Ensure voter hasn't already voted for this candidate
    const existingVote = await this.voteModel.findOne({
      voter: voterId,
      candidate: candidateId,
    });
    if (existingVote) {
      throw new ForbiddenException('You have already voted for this candidate');
    }

    const vote = new this.voteModel({
      voter: voterId,
      candidate: candidateId,
      votedAt: new Date(),
    });
    return vote.save();
  }

  // Count votes for a candidate
  async countVotes(candidateId: string): Promise<number> {
    return this.voteModel.countDocuments({ candidate: candidateId }).exec();
  }

  // Get live vote count for all candidates
  async getLiveResults(): Promise<{ candidateId: string; votes: number }[]> {
    return this.voteModel.aggregate([
      {
        $group: {
          _id: '$candidate',
          votes: { $sum: 1 },
        },
      },
      {
        $project: {
          candidateId: '$_id',
          votes: 1,
          _id: 0,
        },
      },
    ]);
  }

  async findAll(): Promise<Vote[]> {
    return this.voteModel.find().populate('candidate').populate('voter').exec();
  }

  async findById(id: string): Promise<Vote | null> {
    return this.voteModel
      .findById(id)
      .populate('candidate')
      .populate('voter')
      .exec();
  }

  async deleteVote(id: string): Promise<Vote | null> {
    return this.voteModel.findByIdAndDelete(id).exec();
  }
}
