import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import * as redisStore from 'cache-manager-redis-store';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { CommandModule } from './modules/command/command.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Database
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: typeOrmConfig,
            inject: [ConfigService],
        }),

        // Cache with Redis
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
                ttl: configService.get('REDIS_TTL', 3600),
            }),
            inject: [ConfigService],
        }),

        // Rate Limiting
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                ttl: configService.get('THROTTLE_TTL', 60),
                limit: configService.get('THROTTLE_LIMIT', 10),
            }),
            inject: [ConfigService],
        }),

        // Event Emitter
        EventEmitterModule.forRoot({
            wildcard: false,
            delimiter: '.',
            newListener: false,
            removeListener: false,
            maxListeners: 10,
            verboseMemoryLeak: false,
            ignoreErrors: false,
        }),

        // Bull Queue with Redis
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.get('REDIS_HOST'),
                    port: configService.get('REDIS_PORT'),
                },
            }),
            inject: [ConfigService],
        }),

        // Schedule
        ScheduleModule.forRoot(),

        // HTTP Module
        HttpModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                timeout: 5000,
                maxRedirects: 5,
                baseURL: configService.get('EXTERNAL_API_URL'),
            }),
            inject: [ConfigService],
        }),

        // Feature Modules
        AuthModule,
        UsersModule,
        PostsModule,
        WebsocketModule,
        CommandModule,
    ],
})
export class AppModule { }
