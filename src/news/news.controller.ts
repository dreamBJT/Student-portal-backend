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
import { NewsService } from './news.service';
import { News, NewsCategory } from './schemas/news.schema';
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Post()
  create(@Body() newsData: Partial<News>) {
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
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.delete(id);
  }
}
