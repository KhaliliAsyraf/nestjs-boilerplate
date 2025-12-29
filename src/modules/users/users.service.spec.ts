import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
    let service: UsersService;
    let repository: Repository<User>;

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

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createUserDto = {
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123',
            };

            mockRepository.findOne.mockResolvedValue(null);
            mockRepository.create.mockReturnValue(mockUser);
            mockRepository.save.mockResolvedValue(mockUser);

            jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedpassword'));

            const result = await service.create(createUserDto);

            expect(result).toEqual(mockUser);
            expect(mockRepository.create).toHaveBeenCalled();
            expect(mockRepository.save).toHaveBeenCalled();
        });

        it('should throw ConflictException if user already exists', async () => {
            const createUserDto = {
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123',
            };

            mockRepository.findOne.mockResolvedValue(mockUser);

            await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const users = [mockUser];
            mockRepository.find.mockResolvedValue(users);

            const result = await service.findAll();

            expect(result).toEqual(users);
            expect(mockRepository.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            mockRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.findOne(1);

            expect(result).toEqual(mockUser);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['posts'],
            });
        });

        it('should throw NotFoundException if user not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto = { firstName: 'Updated' };
            const updatedUser = { ...mockUser, ...updateUserDto };

            mockRepository.findOne.mockResolvedValue(mockUser);
            mockRepository.save.mockResolvedValue(updatedUser);

            const result = await service.update(1, updateUserDto);

            expect(result.firstName).toEqual('Updated');
            expect(mockRepository.save).toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            mockRepository.findOne.mockResolvedValue(mockUser);
            mockRepository.remove.mockResolvedValue(mockUser);

            await service.remove(1);

            expect(mockRepository.remove).toHaveBeenCalledWith(mockUser);
        });
    });
});
