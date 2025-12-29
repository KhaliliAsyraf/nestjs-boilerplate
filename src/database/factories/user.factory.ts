import { User } from '../../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export class UserFactory {
    static async create(overrides: Partial<User> = {}): Promise<Partial<User>> {
        const defaultUser = {
            email: `user${Date.now()}@example.com`,
            username: `user${Date.now()}`,
            password: await bcrypt.hash('Password123!', 10),
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
            isActive: true,
        };

        return { ...defaultUser, ...overrides };
    }

    static async createMany(count: number, overrides: Partial<User> = {}): Promise<Partial<User>[]> {
        const users: Partial<User>[] = [];
        for (let i = 0; i < count; i++) {
            const user = await this.create({
                ...overrides,
                email: `user${Date.now()}_${i}@example.com`,
                username: `user${Date.now()}_${i}`,
            });
            users.push(user);
        }
        return users;
    }

    static async createAdmin(overrides: Partial<User> = {}): Promise<Partial<User>> {
        return this.create({
            email: 'admin@example.com',
            username: 'admin',
            role: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            ...overrides,
        });
    }
}
