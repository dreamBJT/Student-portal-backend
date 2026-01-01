import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ActivityLogDocument = ActivityLog & Document;

@Schema({ timestamps: true })
export class ActivityLog {
  @Prop({ required: true })
  user: string; // user email or 'system'

  @Prop({ required: true })
  action: string; // description of the action

  @Prop({ required: true })
  type: string; // create, update, delete, auth, vote, system

  @Prop({ required: true, enum: ['success', 'failed', 'pending'] })
  status: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ type: Object })
  details?: any; // additional details about the action

  @Prop({ type: String })
  ipAddress?: string;

  @Prop({ type: String })
  userAgent?: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);
