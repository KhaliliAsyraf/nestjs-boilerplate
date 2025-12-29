import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('notifications')
export class NotificationProcessor {
    private readonly logger = new Logger(NotificationProcessor.name);

    @Process('post-created')
    async handlePostCreated(job: Job) {
        this.logger.log(`Processing post-created job: ${job.id}`);
        const { postId, userId, title } = job.data;

        try {
            // Simulate sending notification
            await this.sendNotification(userId, `New post created: ${title}`);
            this.logger.log(`Notification sent for post ${postId}`);
        } catch (error) {
            this.logger.error(`Failed to process job ${job.id}: ${error.message}`, error.stack);
            throw error;
        }
    }

    private async sendNotification(userId: number, message: string): Promise<void> {
        // Simulate async operation
        return new Promise((resolve) => {
            setTimeout(() => {
                this.logger.log(`Notification to user ${userId}: ${message}`);
                resolve();
            }, 1000);
        });
    }
}
