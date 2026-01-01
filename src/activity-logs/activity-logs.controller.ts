import { Controller, Get, Post, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ActivityLogsService } from './activity-logs.service';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get('recent')
  async getRecentLogs(@Query('limit') limit: string = '50') {
    const logs = await this.activityLogsService.getRecentLogs(parseInt(limit));
    return logs.map(log => ({
      id: log._id,
      user: log.user,
      action: log.action,
      type: log.type,
      status: log.status,
      timestamp: log.timestamp,
      details: log.details,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      time: this.formatTimeAgo(log.timestamp),
    }));
  }

  @Get('stats')
  async getLogStats() {
    return this.activityLogsService.getLogStats();
  }

  @Post('create')
  async createLog(@Res() res: Response) {
    try {
      // This is a sample log creation - in real app, this would be called by other services
      const sampleLog = {
        user: 'system',
        action: 'Activity log system initialized',
        type: 'system',
        status: 'success',
        details: { message: 'Activity logging system started' }
      };
      
      const log = await this.activityLogsService.createLog(sampleLog);
      return res.status(HttpStatus.CREATED).json(log);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create log',
        error: error.message,
      });
    }
  }

  @Delete('cleanup')
  async cleanupOldLogs(@Query('days') days: string = '30') {
    try {
      const result = await this.activityLogsService.deleteOldLogs(parseInt(days));
      return {
        success: true,
        message: `Deleted ${result.deletedCount} old logs`,
        deletedCount: result.deletedCount,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to cleanup logs',
        error: error.message,
      };
    }
  }

  private formatTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }
}
