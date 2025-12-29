import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
    @ApiProperty({ example: 'My First Post' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'This is the content of my first post' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    published?: boolean;
}
