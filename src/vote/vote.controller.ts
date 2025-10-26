import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Req,
} from '@nestjs/common';
import { VotesService } from './vote.service';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    role: 'students' | 'admin' | 'superAdmin';
    id: string;
  };
}

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  castVote(
    @Body('candidateId') candidateId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const voterId = req.user?.id;
    if (!voterId) {
      throw new Error('User not authenticated');
    }
    return this.votesService.castVote(voterId, candidateId);
  }

  @Get('candidate/:id/count')
  countVotes(@Param('id') candidateId: string) {
    return this.votesService.countVotes(candidateId);
  }

  @Get('live-results')
  getLiveResults() {
    return this.votesService.getLiveResults();
  }

  @Get()
  findAll() {
    return this.votesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.votesService.findById(id);
  }

  @Delete(':id')
  deleteVote(@Param('id') id: string) {
    return this.votesService.deleteVote(id);
  }
  @Patch(':id')
  updateVote(@Param('id') id: string, @Body('candidateId') candidateId: string) {
    return this.votesService.updateVote(id, candidateId);
  }
}
