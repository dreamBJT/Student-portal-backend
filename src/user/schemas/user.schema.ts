import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string; // can be string + number mix (like IU2023123 or "abebe12")

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  image: string;

  @Prop({
    required: true,
    enum: ['students', 'admin', 'superAdmin'],
    default: 'students',
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// 🔐 Auto-hash password before saving
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
