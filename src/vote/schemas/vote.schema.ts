import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Candidate } from '../../candidates/schemas/candidate.schema';
import { User } from '../../user/schemas/user.schema';

export type VoteDocument = Vote & Document;

@Schema({ timestamps: true })
export class Vote {
  @Prop({ type: Types.ObjectId, ref: Candidate.name, required: true })
  candidate: Types.ObjectId; // reference to the candidate

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  voter: Types.ObjectId; // reference to the student who voted

  @Prop({ default: new Date() })
  votedAt: Date;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
