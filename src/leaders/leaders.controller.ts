import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LeadersService } from './leaders.service';
import { Leader } from './schemas/leaders.schema';
import { storage } from '../cloudinary/cloudinary.provider';
@Controller('leaders')
export class LeadersController {
  constructor(private readonly leadersService: LeadersService) {}
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage }))
  create(@Body() data: Partial<Leader>, @UploadedFile() file?: any) {
    if (file) {
      const url = (file as any).path;
      (data as any).images = Array.isArray((data as any).images)
        ? [...(data as any).images, url]
        : [url];
    }
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
  @UseInterceptors(FileInterceptor('image', { storage }))
  update(
    @Param('id') id: string,
    @Body() data: Partial<Leader>,
    @UploadedFile() file?: any,
  ) {
    if (file) {
      const url = (file as any).path;
      (data as any).images = Array.isArray((data as any).images)
        ? [...(data as any).images, url]
        : [url];
    }
    return this.leadersService.update(id, data);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadersService.delete(id);
  }
}
