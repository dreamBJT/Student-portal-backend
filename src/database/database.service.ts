import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseService {
  constructor(@InjectConnection() private connection: Connection) {}

  async getDatabaseStatus() {
    try {
      const db = this.connection.db;
      if (!db) {
        throw new Error('Database connection not available');
      }
      
      const admin = db.admin();
      const serverStatus = await admin.serverStatus();
      
      const stats = await db.stats();
      const storageSizeGB = stats.storageSize / (1024 * 1024 * 1024);
      const totalStorageGB = 10; // You can make this configurable
      
      return {
        status: 'healthy',
        connection: 'online',
        storage: {
          used: `${storageSizeGB.toFixed(1)} GB`,
          total: `${totalStorageGB} GB`,
          percentage: Math.round((storageSizeGB / totalStorageGB) * 100)
        },
        activeConnections: serverStatus.connections.current || 12,
        uptime: serverStatus.uptime || 0,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        connection: 'offline',
        error: error.message,
        lastChecked: new Date().toISOString()
      };
    }
  }

  async getDatabaseStats() {
    try {
      const db = this.connection.db;
      if (!db) {
        throw new Error('Database connection not available');
      }
      
      const collections = await db.listCollections().toArray();
      const stats = await db.stats();
      
      const collectionStats: any[] = [];
      for (const collection of collections) {
        const collStats = await (db.collection(collection.name) as any).stats();
        collectionStats.push({
          name: collection.name,
          count: collStats.count || 0,
          size: collStats.size || 0,
          avgObjSize: collStats.avgObjSize || 0
        });
      }

      return {
        databaseName: stats.db,
        collections: collectionStats,
        totalSize: stats.dataSize || 0,
        totalIndexes: stats.indexes || 0,
        indexSize: stats.indexSize || 0,
        storageSize: stats.storageSize || 0
      };
    } catch (error) {
      throw new Error(`Failed to get database stats: ${error.message}`);
    }
  }

  async getBackups() {
    try {
      const backupDir = path.join(process.cwd(), 'backups');
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
        return [];
      }

      const files = fs.readdirSync(backupDir)
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const filePath = path.join(backupDir, file);
          const stats = fs.statSync(filePath);
          
          return {
            name: file,
            size: this.formatFileSize(stats.size),
            date: stats.mtime.toISOString().replace('T', ' ').substring(0, 16),
            status: 'success',
            path: filePath
          };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);

      return files;
    } catch (error) {
      throw new Error(`Failed to get backups: ${error.message}`);
    }
  }

  async createBackup() {
    try {
      const db = this.connection.db;
      if (!db) {
        throw new Error('Database connection not available');
      }
      
      const collections = await db.listCollections().toArray();
      const backupData: any = {};
      
      for (const collection of collections) {
        const documents = await db.collection(collection.name).find({}).toArray();
        backupData[collection.name] = documents;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const filename = `backup_${timestamp}.json`;
      const backupDir = path.join(process.cwd(), 'backups');
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const filePath = path.join(backupDir, filename);
      fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

      return {
        success: true,
        message: 'Backup created successfully',
        filename,
        size: this.formatFileSize(fs.statSync(filePath).size),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Backup failed: ${error.message}`);
    }
  }

  async restoreDatabase() {
    try {
      const latestBackup = await this.getLatestBackup();
      if (!latestBackup) {
        throw new Error('No backup file found');
      }

      const backupData = JSON.parse(fs.readFileSync(latestBackup, 'utf8'));
      const db = this.connection.db;
      if (!db) {
        throw new Error('Database connection not available');
      }

      for (const [collectionName, documents] of Object.entries(backupData)) {
        if (Array.isArray(documents) && documents.length > 0) {
          await db.collection(collectionName).deleteMany({});
          await db.collection(collectionName).insertMany(documents as any[]);
        }
      }

      return {
        success: true,
        message: 'Database restored successfully',
        restoredFrom: latestBackup,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Restore failed: ${error.message}`);
    }
  }

  private async getLatestBackup(): Promise<string | null> {
    try {
      const backupDir = path.join(process.cwd(), 'backups');
      if (!fs.existsSync(backupDir)) return null;

      const files = fs.readdirSync(backupDir)
        .filter(file => file.endsWith('.json'))
        .map(file => path.join(backupDir, file))
        .sort((a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime());

      return files.length > 0 ? files[0] : null;
    } catch (error) {
      return null;
    }
  }

  async getBackupSchedule() {
    return {
      daily: {
        enabled: true,
        time: '02:00 AM',
        description: 'Every day at 2:00 AM'
      },
      weekly: {
        enabled: true,
        time: 'Sunday at 3:00 AM',
        description: 'Every Sunday at 3:00 AM'
      },
      monthly: {
        enabled: true,
        time: '1st of every month',
        description: '1st of every month'
      }
    };
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}
