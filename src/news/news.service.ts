import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { News, NewsDocument, NewsCategory } from './schemas/news.schema';
@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<NewsDocument>) {}

  async create(newsData: Partial<News>): Promise<News> {
    const news = new this.newsModel(newsData);
    return news.save();
  }
  async findAll(category?: NewsCategory): Promise<News[]> {
    if (!category || category === NewsCategory.ALL) {
      return this.newsModel.find().sort({ createdAt: -1 }).exec();
    }
    return this.newsModel.find({ category }).sort({ createdAt: -1 }).exec();
  }
  async findOne(id: string): Promise<News> {
    const news = await this.newsModel.findById(id).exec();
    if (!news) throw new NotFoundException('News not found');
    return news;
  }
  async incrementViews(id: string): Promise<News | null> {
    return this.newsModel
      .findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
      .exec();
  }
  async addComment(id: string, userId: string, comment: string): Promise<News | null> {
    return this.newsModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            comments: {
              userId: new Types.ObjectId(userId),
              comment,
              createdAt: new Date(),
            },
          },
        },
        { new: true },
      )
      .exec();
  }
  async delete(id: string): Promise<void> {
    const result = await this.newsModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('News not found');
  }
}
