import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Election, ElectionSchema } from './schemas/elections.schema';
import { ElectionsService } from './elections.service';
import { ElectionsController } from './elections.controller';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Election.name, schema: ElectionSchema },
    ]),
  ],
  providers: [ElectionsService],
  controllers: [ElectionsController],
})
export class ElectionsModule {}
