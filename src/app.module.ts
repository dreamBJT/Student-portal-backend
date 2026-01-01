// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CandidatesModule } from './candidates/candidates.module';
import { VotesModule } from './vote/vote.module';
import { LeadersModule } from './leaders/leaders.module';
import { NewsModule } from './news/news.module';
import { ElectionsModule } from './elections/elections.module';
import { DatabaseModule } from './database/database.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    UserModule,
    AuthModule,
    CandidatesModule,
    VotesModule,
    LeadersModule,
    NewsModule,
    ElectionsModule,
    DatabaseModule,
    ActivityLogsModule,
  ],
})
export class AppModule {}
