import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';

@Module({
  imports: [MongooseModule],
  controllers: [DatabaseController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
