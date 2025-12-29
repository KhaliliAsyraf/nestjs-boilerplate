import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Command({
    name: 'seed:users',
    description: 'Seed users into the database',
})
export class SeedUsersCommand extends CommandRunner {
    private readonly logger = new Logger(SeedUsersCommand.name);

    constructor(private readonly usersService: UsersService) {
        super();
    }

    async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
        try {
            this.logger.log('Starting user seeding...');

            const users = [
                {
                    email: 'admin@example.com',
                    username: 'admin',
                    password: 'Admin123!',
                    firstName: 'Admin',
                    lastName: 'User',
                    role: 'admin',
                },
                {
                    email: 'user@example.com',
                    username: 'user',
                    password: 'User123!',
                    firstName: 'Regular',
                    lastName: 'User',
                    role: 'user',
                },
            ];

            for (const userData of users) {
                try {
                    await this.usersService.create(userData);
                    this.logger.log(`Created user: ${userData.email}`);
                } catch (error) {
                    this.logger.warn(`User ${userData.email} might already exist`);
                }
            }

            this.logger.log('User seeding completed!');
        } catch (error) {
            this.logger.error(`Seeding failed: ${error.message}`, error.stack);
            throw error;
        }
    }
}
