import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { PostEventsListener } from './listeners/post-events.listener';
import { NotificationProcessor } from './processors/notification.processor';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post]),
        HttpModule,
        BullModule.registerQueue({
            name: 'notifications',
        }),
    ],
    controllers: [PostsController],
    providers: [PostsService, PostEventsListener, NotificationProcessor],
    exports: [PostsService],
})
export class PostsModule { }
