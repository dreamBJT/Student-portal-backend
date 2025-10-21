import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { Candidate } from './schemas/candidate.schema';
import { Request } from 'express';

// Type-safe request for roles
interface AuthenticatedRequest extends Request {
  user?: {
    role: 'students' | 'admin' | 'superAdmin';
    id: string; // admin ID
  };
}

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  create(
    @Body() candidateData: Partial<Candidate>,
    @Req() req: AuthenticatedRequest,
  ) {
    const currentUserRole = req.user?.role ?? 'students';
    const creatorId = req.user?.id ?? '';
    return this.candidatesService.create(
      candidateData,
      currentUserRole,
      creatorId,
    );
  }

  @Get()
  findAll() {
    return this.candidatesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.candidatesService.findById(id);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'Pending' | 'Approved' | 'Rejected',
  ) {
    return this.candidatesService.updateStatus(id, status);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.candidatesService.delete(id);
  }
}
