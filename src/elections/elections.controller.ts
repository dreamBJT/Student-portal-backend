import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ElectionsService } from './elections.service';
import { Election } from './schemas/elections.schema';
@Controller('elections')
export class ElectionsController {
  constructor(private readonly electionsService: ElectionsService) {}
  @Post()
  create(@Body() data: Partial<Election>) {
    return this.electionsService.create(data);
  }
  @Get()
  findAll() {
    return this.electionsService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.electionsService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Election>) {
    return this.electionsService.update(id, data);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.electionsService.delete(id);
  }
}
