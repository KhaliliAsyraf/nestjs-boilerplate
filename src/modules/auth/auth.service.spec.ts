import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let service: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: '$2b$10$hashedpassword',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        posts: [],
    };

    const mockUsersService = {
        create: jest.fn(),
        findByEmail: jest.fn(),
        findByUsername: jest.fn(),
        findOne: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('register', () => {
        it('should register a new user and return access token', async () => {
            const registerDto = {
                email: 'test@example.com',
                username: 'testuser',
                password: 'password123',
            };

            mockUsersService.create.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue('jwt-token');

            const result = await service.register(registerDto);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('accessToken');
            expect(result.accessToken).toBe('jwt-token');
            expect(mockUsersService.create).toHaveBeenCalledWith(registerDto);
        });
    });

    describe('login', () => {
        it('should login user with email and return access token', async () => {
            const loginDto = {
                emailOrUsername: 'test@example.com',
                password: 'password123',
            };

            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue('jwt-token');
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

            const result = await service.login(loginDto);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('accessToken');
            expect(result.accessToken).toBe('jwt-token');
        });

        it('should login user with username and return access token', async () => {
            const loginDto = {
                emailOrUsername: 'testuser',
                password: 'password123',
            };

            mockUsersService.findByEmail.mockResolvedValue(null);
            mockUsersService.findByUsername.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue('jwt-token');
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

            const result = await service.login(loginDto);

            expect(result).toHaveProperty('accessToken');
        });

        it('should throw UnauthorizedException for invalid credentials', async () => {
            const loginDto = {
                emailOrUsername: 'test@example.com',
                password: 'wrongpassword',
            };

            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if user not found', async () => {
            const loginDto = {
                emailOrUsername: 'nonexistent@example.com',
                password: 'password123',
            };

            mockUsersService.findByEmail.mockResolvedValue(null);
            mockUsersService.findByUsername.mockResolvedValue(null);

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if user is inactive', async () => {
            const inactiveUser = { ...mockUser, isActive: false };
            const loginDto = {
                emailOrUsername: 'test@example.com',
                password: 'password123',
            };

            mockUsersService.findByEmail.mockResolvedValue(inactiveUser);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('validateUser', () => {
        it('should return user if valid', async () => {
            mockUsersService.findOne.mockResolvedValue(mockUser);

            const result = await service.validateUser(1);

            expect(result).toEqual(mockUser);
        });

        it('should throw UnauthorizedException if user not found', async () => {
            mockUsersService.findOne.mockRejectedValue(new Error('User not found'));

            await expect(service.validateUser(999)).rejects.toThrow(UnauthorizedException);
        });
    });
});
