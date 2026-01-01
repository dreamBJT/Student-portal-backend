import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('status')
  async getDatabaseStatus() {
    return this.databaseService.getDatabaseStatus();
  }

  @Get('backups')
  async getBackups() {
    return this.databaseService.getBackups();
  }

  @Post('backup')
  async createBackup() {
    return this.databaseService.createBackup();
  }

  @Post('restore')
  async restoreBackup(@Res() res: Response) {
    try {
      const result = await this.databaseService.restoreDatabase();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Restore failed',
        error: error.message,
      });
    }
  }

  @Get('schedule')
  async getBackupSchedule() {
    return this.databaseService.getBackupSchedule();
  }

  @Get('stats')
  async getDatabaseStats() {
    return this.databaseService.getDatabaseStats();
  }
}
