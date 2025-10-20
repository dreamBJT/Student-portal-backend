import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { CandidatesModule } from './candidates/candidates.module';
import { VotesModule } from './vote/vote.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/voting-system'),
    UserModule,
    CandidatesModule,
    VotesModule, // <-- must import the module, do NOT list service as provider
  ],
})
export class AppModule {}
