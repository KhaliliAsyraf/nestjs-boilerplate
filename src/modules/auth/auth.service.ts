import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto): Promise<{ user: User; accessToken: string }> {
        try {
            const user = await this.usersService.create(registerDto);
            const accessToken = await this.generateToken(user);

            return { user, accessToken };
        } catch (error) {
            this.logger.error(`Registration failed: ${error.message}`, error.stack);
            throw error;
        }
    }

    async login(loginDto: LoginDto): Promise<{ user: User; accessToken: string }> {
        try {
            // Find user by email or username
            let user = await this.usersService.findByEmail(loginDto.emailOrUsername);
            if (!user) {
                user = await this.usersService.findByUsername(loginDto.emailOrUsername);
            }

            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            if (!user.isActive) {
                throw new UnauthorizedException('Account is inactive');
            }

            const accessToken = await this.generateToken(user);

            return { user, accessToken };
        } catch (error) {
            this.logger.error(`Login failed: ${error.message}`, error.stack);
            throw error;
        }
    }

    async validateUser(userId: number): Promise<User> {
        try {
            return await this.usersService.findOne(userId);
        } catch (error) {
            this.logger.error(`User validation failed: ${error.message}`, error.stack);
            throw new UnauthorizedException('Invalid token');
        }
    }

    private async generateToken(user: User): Promise<string> {
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        };

        return this.jwtService.sign(payload);
    }
}
