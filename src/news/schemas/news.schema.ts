import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type NewsDocument = News & Document;
export enum NewsCategory {
  ELECTION = 'election',
  GENERAL = 'general',
  LEADERSHIP = 'leadership',
  ALL = 'all',
}
@Schema({ timestamps: true })
export class News {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  content: string;
  @Prop({ type: String, enum: NewsCategory, default: NewsCategory.ALL })
  category: NewsCategory;
  @Prop()
  imageUrl: string;
  @Prop({ default: 0 })
  views: number;
  @Prop({
    type: [{ userId: Types.ObjectId, comment: String, createdAt: Date }],
  })
  comments: {
    userId: Types.ObjectId;
    comment: string;
    createdAt: Date;
  }[];
}
export const NewsSchema = SchemaFactory.createForClass(News);
NewsSchema.index({ title: 'text', category: 1 });
