import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class AppService implements OnModuleDestroy {
  private readonly database = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  getHello(): string {
    return 'Hello World!';
  }

  async getHealth() {
    const result = await this.database.query('SELECT NOW() AS database_time');
    return {
      status: 'ok',
      database: 'connected',
      databaseTime: result.rows[0].database_time,
    };
  }

  async onModuleDestroy() {
    await this.database.end();
  }
}
