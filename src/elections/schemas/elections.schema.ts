import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type ElectionDocument = Election & Document;
@Schema({ timestamps: true })
export class Election {
  @Prop({ required: true })
  title: string; 
  @Prop({ type: [String], required: true })
  positions: string[]; 
  @Prop({ required: true })
  startDate: Date;
  @Prop({ required: true })
  endDate: Date;
  @Prop()
  description: string;
  @Prop({ required: true, default: 10 })
  maxCandidates: number;
  @Prop({ default: false })
  liveResults: boolean; 
}
export const ElectionSchema = SchemaFactory.createForClass(Election);
ElectionSchema.index({ startDate: 1, endDate: 1 });
