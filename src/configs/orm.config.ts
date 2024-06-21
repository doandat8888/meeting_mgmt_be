import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async(configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PGHOST'),
        username: configService.get<string>('PGUSER'),
        password: configService.get<string>('PGPASSWORD'),
        port: parseInt(configService.get<string>('PGPORT')),
        database: configService.get<string>('PGDATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        ssl: true,
    }),
    inject: [ConfigService]
}