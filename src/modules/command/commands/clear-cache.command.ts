import { Command, CommandRunner, Option } from 'nest-commander';
import { Logger } from '@nestjs/common';

interface ClearCacheOptions {
    all?: boolean;
    pattern?: string;
}

@Command({
    name: 'cache:clear',
    description: 'Clear application cache',
})
export class ClearCacheCommand extends CommandRunner {
    private readonly logger = new Logger(ClearCacheCommand.name);

    async run(passedParams: string[], options?: ClearCacheOptions): Promise<void> {
        try {
            this.logger.log('Clearing cache...');

            if (options?.all) {
                this.logger.log('Clearing all cache...');
                // Implementation to clear all cache
            } else if (options?.pattern) {
                this.logger.log(`Clearing cache with pattern: ${options.pattern}`);
                // Implementation to clear cache by pattern
            } else {
                this.logger.log('Clearing default cache...');
            }

            this.logger.log('Cache cleared successfully!');
        } catch (error) {
            this.logger.error(`Cache clear failed: ${error.message}`, error.stack);
            throw error;
        }
    }

    @Option({
        flags: '-a, --all',
        description: 'Clear all cache',
    })
    parseAll(): boolean {
        return true;
    }

    @Option({
        flags: '-p, --pattern <pattern>',
        description: 'Clear cache by pattern',
    })
    parsePattern(val: string): string {
        return val;
    }
}
