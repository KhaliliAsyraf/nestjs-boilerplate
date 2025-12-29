import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class PostEventsListener {
    private readonly logger = new Logger(PostEventsListener.name);

    constructor(
        @InjectQueue('notifications') private readonly notificationQueue: Queue,
    ) { }

    @OnEvent('post.created')
    async handlePostCreatedEvent(payload: any) {
        this.logger.log(`Post created event received: ${payload.post.id}`);

        // Add job to queue
        await this.notificationQueue.add('post-created', {
            postId: payload.post.id,
            userId: payload.user.id,
            title: payload.post.title,
        });
    }

    @OnEvent('post.updated')
    handlePostUpdatedEvent(payload: any) {
        this.logger.log(`Post updated event received: ${payload.post.id}`);
    }

    @OnEvent('post.deleted')
    handlePostDeletedEvent(payload: any) {
        this.logger.log(`Post deleted event received: ${payload.postId}`);
    }
}
