import { Module } from '@nestjs/common';
import { CommandModule as NestCommandModule } from 'nest-commander';
import { SeedUsersCommand } from './commands/seed-users.command';
import { ClearCacheCommand } from './commands/clear-cache.command';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [NestCommandModule, UsersModule],
    providers: [SeedUsersCommand, ClearCacheCommand],
})
export class CommandModule { }
