import { Post } from '../../modules/posts/entities/post.entity';

export class PostFactory {
    static create(authorId: number, overrides: Partial<Post> = {}): Partial<Post> {
        const defaultPost = {
            title: `Post Title ${Date.now()}`,
            content: 'This is a sample post content. Lorem ipsum dolor sit amet.',
            published: false,
            authorId,
        };

        return { ...defaultPost, ...overrides };
    }

    static createMany(
        authorId: number,
        count: number,
        overrides: Partial<Post> = {},
    ): Partial<Post>[] {
        const posts: Partial<Post>[] = [];
        for (let i = 0; i < count; i++) {
            const post = this.create(authorId, {
                ...overrides,
                title: `Post Title ${Date.now()}_${i}`,
            });
            posts.push(post);
        }
        return posts;
    }

    static createPublished(authorId: number, overrides: Partial<Post> = {}): Partial<Post> {
        return this.create(authorId, {
            published: true,
            ...overrides,
        });
    }
}
