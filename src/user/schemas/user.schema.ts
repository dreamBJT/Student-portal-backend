import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  studentId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  department: string;

  @Prop({
    required: true,
    enum: ['students', 'admin', 'superAdmin'],
    default: 'students',
  })
  role: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  hasVoted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
