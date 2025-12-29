import {
    Injectable,
    NotFoundException,
    Logger,
    Inject,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
    private readonly logger = new Logger(PostsService.name);

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
        private readonly eventEmitter: EventEmitter2,
        private readonly httpService: HttpService,
    ) { }

    async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
        try {
            const post = this.postRepository.create({
                ...createPostDto,
                authorId: user.id,
            });

            const savedPost = await this.postRepository.save(post);

            // Emit event
            this.eventEmitter.emit('post.created', { post: savedPost, user });

            // Clear cache
            await this.cacheManager.del('posts:all');

            this.logger.log(`Post created: ${savedPost.id} by user ${user.id}`);

            return savedPost;
        } catch (error) {
            this.logger.error(`Failed to create post: ${error.message}`, error.stack);
            throw error;
        }
    }

    async findAll(): Promise<Post[]> {
        try {
            // Try to get from cache
            const cachedPosts = await this.cacheManager.get<Post[]>('posts:all');
            if (cachedPosts) {
                this.logger.log('Posts retrieved from cache');
                return cachedPosts;
            }

            // Get from database
            const posts = await this.postRepository.find({
                order: { createdAt: 'DESC' },
            });

            // Store in cache
            await this.cacheManager.set('posts:all', posts, 300); // 5 minutes

            return posts;
        } catch (error) {
            this.logger.error(`Failed to fetch posts: ${error.message}`, error.stack);
            throw error;
        }
    }

    async findOne(id: number): Promise<Post> {
        try {
            // Try to get from cache
            const cacheKey = `post:${id}`;
            const cachedPost = await this.cacheManager.get<Post>(cacheKey);
            if (cachedPost) {
                this.logger.log(`Post ${id} retrieved from cache`);
                return cachedPost;
            }

            const post = await this.postRepository.findOne({ where: { id } });

            if (!post) {
                throw new NotFoundException(`Post with ID ${id} not found`);
            }

            // Store in cache
            await this.cacheManager.set(cacheKey, post, 300);

            return post;
        } catch (error) {
            this.logger.error(`Failed to fetch post ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async update(id: number, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
        try {
            const post = await this.findOne(id);

            // Check if user is the author
            if (post.authorId !== user.id) {
                throw new ForbiddenException('You can only update your own posts');
            }

            Object.assign(post, updatePostDto);
            const updatedPost = await this.postRepository.save(post);

            // Clear cache
            await this.cacheManager.del(`post:${id}`);
            await this.cacheManager.del('posts:all');

            // Emit event
            this.eventEmitter.emit('post.updated', { post: updatedPost, user });

            return updatedPost;
        } catch (error) {
            this.logger.error(`Failed to update post ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async remove(id: number, user: User): Promise<void> {
        try {
            const post = await this.findOne(id);

            // Check if user is the author
            if (post.authorId !== user.id) {
                throw new ForbiddenException('You can only delete your own posts');
            }

            await this.postRepository.remove(post);

            // Clear cache
            await this.cacheManager.del(`post:${id}`);
            await this.cacheManager.del('posts:all');

            // Emit event
            this.eventEmitter.emit('post.deleted', { postId: id, user });

            this.logger.log(`Post ${id} deleted by user ${user.id}`);
        } catch (error) {
            this.logger.error(`Failed to delete post ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }

    // Example of using HTTP service to fetch external data
    async fetchExternalData(): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get('https://jsonplaceholder.typicode.com/posts/1'),
            );
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to fetch external data: ${error.message}`, error.stack);
            throw error;
        }
    }
}
