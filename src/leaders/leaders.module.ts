import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Leader, LeaderSchema } from './schemas/leaders.schema';
import { LeadersService } from './leaders.service';
import { LeadersController } from './leaders.controller';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Leader.name, schema: LeaderSchema }]),
  ],
  providers: [LeadersService],
  controllers: [LeadersController],
})
export class LeadersModule {}
