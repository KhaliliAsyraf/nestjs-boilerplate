import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @ApiOperation({ summary: 'Create a new post' })
    @ApiResponse({ status: 201, description: 'Post created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
        return this.postsService.create(createPostDto, user);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all posts' })
    @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
    findAll() {
        return this.postsService.findAll();
    }

    @Get('external')
    @ApiOperation({ summary: 'Fetch external data example' })
    @ApiResponse({ status: 200, description: 'External data retrieved' })
    fetchExternal() {
        return this.postsService.fetchExternalData();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get post by ID' })
    @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update post' })
    @ApiResponse({ status: 200, description: 'Post updated successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - not the author' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePostDto: UpdatePostDto,
        @GetUser() user: User,
    ) {
        return this.postsService.update(id, updatePostDto, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete post' })
    @ApiResponse({ status: 200, description: 'Post deleted successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - not the author' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
        return this.postsService.remove(id, user);
    }
}
