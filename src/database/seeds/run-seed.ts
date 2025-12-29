import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Post } from '../../modules/posts/entities/post.entity';
import { UserFactory } from '../factories/user.factory';
import { PostFactory } from '../factories/post.factory';
import dataSource from '../../config/typeorm.config';

async function runSeed() {
    try {
        console.log('🌱 Starting database seeding...');

        // Initialize data source
        await dataSource.initialize();

        const userRepository = dataSource.getRepository(User);
        const postRepository = dataSource.getRepository(Post);

        // Clear existing data
        console.log('Clearing existing data...');
        await postRepository.delete({});
        await userRepository.delete({});

        // Seed admin user
        console.log('Creating admin user...');
        const adminData = await UserFactory.createAdmin();
        const admin = userRepository.create(adminData);
        await userRepository.save(admin);
        console.log(`✓ Admin created: ${admin.email}`);

        // Seed regular users
        console.log('Creating regular users...');
        const usersData = await UserFactory.createMany(5);
        const users = userRepository.create(usersData);
        await userRepository.save(users);
        console.log(`✓ Created ${users.length} users`);

        // Seed posts for admin
        console.log('Creating posts for admin...');
        const adminPosts = PostFactory.createMany(admin.id, 3, { published: true });
        const adminPostEntities = postRepository.create(adminPosts);
        await postRepository.save(adminPostEntities);
        console.log(`✓ Created ${adminPostEntities.length} posts for admin`);

        // Seed posts for regular users
        console.log('Creating posts for users...');
        for (const user of users) {
            const userPosts = PostFactory.createMany(user.id, 2);
            const userPostEntities = postRepository.create(userPosts);
            await postRepository.save(userPostEntities);
        }
        console.log(`✓ Created posts for ${users.length} users`);

        console.log('✅ Database seeding completed successfully!');
        await dataSource.destroy();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

runSeed();
