import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateUsersTable1703000000001 } from '../database/migrations/1703000000001-CreateUsersTable';
import { CreatePostsTable1703000000002 } from '../database/migrations/1703000000002-CreatePostsTable';

@Injectable()
export class MigrationService implements OnModuleInit {
    private readonly logger = new Logger(MigrationService.name);

    constructor(private readonly dataSource: DataSource) { }

    async onModuleInit() {
        this.logger.log('Running database migrations...');

        try {
            const queryRunner = this.dataSource.createQueryRunner();

            // Create migrations table if it doesn't exist
            await queryRunner.query(`
                CREATE TABLE IF NOT EXISTS migrations (
                    id SERIAL PRIMARY KEY,
                    timestamp BIGINT NOT NULL,
                    name VARCHAR NOT NULL
                )
            `);

            // Check and run migrations
            await this.runMigration(queryRunner, 1703000000001, 'CreateUsersTable', new CreateUsersTable1703000000001());
            await this.runMigration(queryRunner, 1703000000002, 'CreatePostsTable', new CreatePostsTable1703000000002());

            await queryRunner.release();
            this.logger.log('Migrations completed successfully');
        } catch (error) {
            this.logger.error('Migration failed:', error);
            throw error;
        }
    }

    private async runMigration(queryRunner: any, timestamp: number, name: string, migration: any) {
        const result = await queryRunner.query(
            'SELECT * FROM migrations WHERE timestamp = $1',
            [timestamp]
        );

        if (result.length === 0) {
            this.logger.log(`Running migration: ${name}`);
            await migration.up(queryRunner);
            await queryRunner.query(
                'INSERT INTO migrations (timestamp, name) VALUES ($1, $2)',
                [timestamp, name]
            );
            this.logger.log(`Migration ${name} completed`);
        } else {
            this.logger.log(`Migration ${name} already applied, skipping`);
        }
    }
}
