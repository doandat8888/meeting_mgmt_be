import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions } from "@nestjs/jwt";

export const jwtConfig: JwtModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async(configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
    }),
    inject: [ConfigService],
}