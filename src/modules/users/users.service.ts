import { Injectable, NotFoundException, Logger, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            // Check if user already exists
            const existingUser = await this.userRepository.findOne({
                where: [
                    { email: createUserDto.email },
                    { username: createUserDto.username },
                ],
            });

            if (existingUser) {
                throw new ConflictException('User with this email or username already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

            const user = this.userRepository.create({
                ...createUserDto,
                password: hashedPassword,
            });

            return await this.userRepository.save(user);
        } catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`, error.stack);
            throw error;
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return await this.userRepository.find({
                relations: ['posts'],
            });
        } catch (error) {
            this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
            throw error;
        }
    }

    async findOne(id: number): Promise<User> {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
                relations: ['posts'],
            });

            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            return user;
        } catch (error) {
            this.logger.error(`Failed to fetch user ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            return await this.userRepository.findOne({ where: { email } });
        } catch (error) {
            this.logger.error(`Failed to find user by email: ${error.message}`, error.stack);
            throw error;
        }
    }

    async findByUsername(username: string): Promise<User | null> {
        try {
            return await this.userRepository.findOne({ where: { username } });
        } catch (error) {
            this.logger.error(`Failed to find user by username: ${error.message}`, error.stack);
            throw error;
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            const user = await this.findOne(id);

            if (updateUserDto.password) {
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
            }

            Object.assign(user, updateUserDto);
            return await this.userRepository.save(user);
        } catch (error) {
            this.logger.error(`Failed to update user ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const user = await this.findOne(id);
            await this.userRepository.remove(user);
        } catch (error) {
            this.logger.error(`Failed to delete user ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
}
