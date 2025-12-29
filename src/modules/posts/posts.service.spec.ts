import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { of } from 'rxjs';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';

describe('PostsService', () => {
    let service: PostsService;
    let repository: Repository<Post>;
    let cacheManager: any;
    let eventEmitter: EventEmitter2;
    let httpService: HttpService;

    const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedpassword',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        posts: [],
    };

    const mockPost: Post = {
        id: 1,
        title: 'Test Post',
        content: 'Test Content',
        published: false,
        authorId: 1,
        author: mockUser,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    const mockCacheManager = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    };

    const mockEventEmitter = {
        emit: jest.fn(),
    };

    const mockHttpService = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostsService,
                {
                    provide: getRepositoryToken(Post),
                    useValue: mockRepository,
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: mockCacheManager,
                },
                {
                    provide: EventEmitter2,
                    useValue: mockEventEmitter,
                },
                {
                    provide: HttpService,
                    useValue: mockHttpService,
                },
            ],
        }).compile();

        service = module.get<PostsService>(PostsService);
        repository = module.get<Repository<Post>>(getRepositoryToken(Post));
        cacheManager = module.get(CACHE_MANAGER);
        eventEmitter = module.get<EventEmitter2>(EventEmitter2);
        httpService = module.get<HttpService>(HttpService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new post', async () => {
            const createPostDto = {
                title: 'Test Post',
                content: 'Test Content',
            };

            mockRepository.create.mockReturnValue(mockPost);
            mockRepository.save.mockResolvedValue(mockPost);
            mockCacheManager.del.mockResolvedValue(true);

            const result = await service.create(createPostDto, mockUser);

            expect(result).toEqual(mockPost);
            expect(mockRepository.create).toHaveBeenCalled();
            expect(mockRepository.save).toHaveBeenCalled();
            expect(mockEventEmitter.emit).toHaveBeenCalledWith('post.created', {
                post: mockPost,
                user: mockUser,
            });
            expect(mockCacheManager.del).toHaveBeenCalledWith('posts:all');
        });
    });

    describe('findAll', () => {
        it('should return cached posts if available', async () => {
            const posts = [mockPost];
            mockCacheManager.get.mockResolvedValue(posts);

            const result = await service.findAll();

            expect(result).toEqual(posts);
            expect(mockCacheManager.get).toHaveBeenCalledWith('posts:all');
            expect(mockRepository.find).not.toHaveBeenCalled();
        });

        it('should fetch from database and cache if not in cache', async () => {
            const posts = [mockPost];
            mockCacheManager.get.mockResolvedValue(null);
            mockRepository.find.mockResolvedValue(posts);
            mockCacheManager.set.mockResolvedValue(true);

            const result = await service.findAll();

            expect(result).toEqual(posts);
            expect(mockRepository.find).toHaveBeenCalled();
            expect(mockCacheManager.set).toHaveBeenCalledWith('posts:all', posts, 300);
        });
    });

    describe('findOne', () => {
        it('should return cached post if available', async () => {
            mockCacheManager.get.mockResolvedValue(mockPost);

            const result = await service.findOne(1);

            expect(result).toEqual(mockPost);
            expect(mockCacheManager.get).toHaveBeenCalledWith('post:1');
        });

        it('should throw NotFoundException if post not found', async () => {
            mockCacheManager.get.mockResolvedValue(null);
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a post', async () => {
            const updatePostDto = { title: 'Updated Title' };
            const updatedPost = { ...mockPost, ...updatePostDto };

            mockCacheManager.get.mockResolvedValue(mockPost);
            mockRepository.save.mockResolvedValue(updatedPost);
            mockCacheManager.del.mockResolvedValue(true);

            const result = await service.update(1, updatePostDto, mockUser);

            expect(result.title).toEqual('Updated Title');
            expect(mockEventEmitter.emit).toHaveBeenCalledWith('post.updated', {
                post: updatedPost,
                user: mockUser,
            });
        });

        it('should throw ForbiddenException if user is not the author', async () => {
            const otherUser = { ...mockUser, id: 2 };
            mockCacheManager.get.mockResolvedValue(mockPost);

            await expect(service.update(1, {}, otherUser)).rejects.toThrow(ForbiddenException);
        });
    });

    describe('remove', () => {
        it('should remove a post', async () => {
            mockCacheManager.get.mockResolvedValue(mockPost);
            mockRepository.remove.mockResolvedValue(mockPost);
            mockCacheManager.del.mockResolvedValue(true);

            await service.remove(1, mockUser);

            expect(mockRepository.remove).toHaveBeenCalledWith(mockPost);
            expect(mockEventEmitter.emit).toHaveBeenCalledWith('post.deleted', {
                postId: 1,
                user: mockUser,
            });
        });

        it('should throw ForbiddenException if user is not the author', async () => {
            const otherUser = { ...mockUser, id: 2 };
            mockCacheManager.get.mockResolvedValue(mockPost);

            await expect(service.remove(1, otherUser)).rejects.toThrow(ForbiddenException);
        });
    });

    describe('fetchExternalData', () => {
        it('should fetch external data successfully', async () => {
            const externalData = { id: 1, title: 'External Post' };
            mockHttpService.get.mockReturnValue(of({ data: externalData }));

            const result = await service.fetchExternalData();

            expect(result).toEqual(externalData);
            expect(mockHttpService.get).toHaveBeenCalled();
        });
    });
});
