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
import { NewsService } from './news.service';
import { News, NewsCategory } from './schemas/news.schema';
import { storage } from '../cloudinary/cloudinary.provider';
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage }))
  create(@Body() newsData: Partial<News>, @UploadedFile() file?: any) {
    if (file) {
      (newsData as any).imageUrl = (file as any).path;
    }
    return this.newsService.create(newsData);
  }
  @Get()
  findAll(@Query('category') category?: NewsCategory) {
    return this.newsService.findAll(category);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }
  @Patch(':id/views')
  incrementViews(@Param('id') id: string) {
    return this.newsService.incrementViews(id);
  }
  @Patch(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() body: { userId: string; comment: string },
  ) {
    return this.newsService.addComment(id, body.userId, body.comment);
  }
  @Get(':id/comments')
getComments(@Param('id') id: string) {
  return this.newsService.getComments(id);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.delete(id);
  }
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', { storage }))
  update(
    @Param('id') id: string,
    @Body() newsData: Partial<News>,
    @UploadedFile() file?: any,
  ) {
    if (file) {
      (newsData as any).imageUrl = (file as any).path;
    }
    return this.newsService.update(id, newsData);
  }
}
