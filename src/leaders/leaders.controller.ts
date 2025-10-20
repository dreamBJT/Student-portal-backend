import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { LeadersService } from './leaders.service';
import { Leader } from './schemas/leaders.schema';
@Controller('leaders')
export class LeadersController {
  constructor(private readonly leadersService: LeadersService) {}
  @Post()
  create(@Body() data: Partial<Leader>) {
    return this.leadersService.create(data);
  }
  @Get()
  findAll(
    @Query('role') role?: string,
    @Query('department') department?: string,
  ) {
    return this.leadersService.findAll(role, department);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadersService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Leader>) {
    return this.leadersService.update(id, data);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadersService.delete(id);
  }
}
