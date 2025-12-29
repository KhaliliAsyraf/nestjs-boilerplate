import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreatePostsTable1703000000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'posts',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'content',
                        type: 'text',
                    },
                    {
                        name: 'published',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'author_id',
                        type: 'int',
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'posts',
            new TableForeignKey({
                columnNames: ['author_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('posts');
        const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('author_id') !== -1);
        await queryRunner.dropForeignKey('posts', foreignKey);
        await queryRunner.dropTable('posts');
    }
}
