import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type LeaderDocument = Leader & Document;
@Schema({ timestamps: true })
export class Leader {
  @Prop({ required: true })
  role: string;
  @Prop({ required: true })
  department: string;
  @Prop({ required: true })
  name: string;
  @Prop()
  slogan: string;
  @Prop({ type: [String], default: [] })
  socialMediaLinks: string[];
  @Prop({ type: [String], default: [] })
  images: string[];
}
export const LeaderSchema = SchemaFactory.createForClass(Leader);
LeaderSchema.index({ name: 'text', role: 1, department: 1 });
