import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from './schemas/activity-log.schema';

@Injectable()
export class ActivityLogsService {
  constructor(@InjectModel(ActivityLog.name) private activityLogModel: Model<ActivityLogDocument>) {}

  async createLog(logData: Partial<ActivityLog>): Promise<ActivityLogDocument> {
    const log = new this.activityLogModel({
      ...logData,
      timestamp: logData.timestamp || new Date(),
    });
    return log.save();
  }

  async getRecentLogs(limit: number = 50): Promise<ActivityLogDocument[]> {
    return this.activityLogModel
      .find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async getLogStats(): Promise<any> {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      totalLogs,
      successfulLogs,
      failedLogs,
      authLogs,
    ] = await Promise.all([
      this.activityLogModel.countDocuments({ timestamp: { $gte: last24Hours } }),
      this.activityLogModel.countDocuments({ 
        timestamp: { $gte: last24Hours }, 
        status: 'success' 
      }),
      this.activityLogModel.countDocuments({ 
        timestamp: { $gte: last24Hours }, 
        status: 'failed' 
      }),
      this.activityLogModel.countDocuments({ 
        timestamp: { $gte: last24Hours }, 
        type: 'auth' 
      }),
    ]);

    const successRate = totalLogs > 0 ? ((successfulLogs / totalLogs) * 100).toFixed(1) : '0';
    const failureRate = totalLogs > 0 ? ((failedLogs / totalLogs) * 100).toFixed(1) : '0';

    return {
      totalLogs,
      successfulLogs,
      failedLogs,
      authLogs,
      successRate,
      failureRate,
    };
  }

  async getLogsByType(type: string, limit: number = 20): Promise<ActivityLogDocument[]> {
    return this.activityLogModel
      .find({ type })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
  }

  async deleteOldLogs(daysOld: number = 30): Promise<{ deletedCount: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const result = await this.activityLogModel.deleteMany({
      timestamp: { $lt: cutoffDate }
    });
    
    return { deletedCount: result.deletedCount };
  }
}
