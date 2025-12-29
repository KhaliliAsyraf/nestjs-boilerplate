import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    getHello(): object {
        return {
            message: 'NestJS Boilerplate API is running!',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
        };
    }

    @Get('health')
    getHealth(): object {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }
}
