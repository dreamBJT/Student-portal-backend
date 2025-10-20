import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CandidateDocument = Candidate & Document;

@Schema({ timestamps: true })
export class Candidate {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  year: number;

  @Prop({ default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] })
  status: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  image?: string;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
