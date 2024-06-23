import { HandlebarsAdapter } from "@nest-modules/mailer";
import { MailerAsyncOptions } from "@nest-modules/mailer/dist/interfaces/mailer-async-options.interface";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";

export const mailerconfig: MailerAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async(configService: ConfigService) => ({
        transport: {
            host: configService.get<string>('MAIL_HOST'),
            secure: false,
            auth: {
                user: configService.get<string>('MAIL_USER'),
                pass: configService.get<string>('MAIL_PASS')
            }
        },
        defaults: {
            from: `"No reply" <${configService.get('MAIL_FROM')}>`
        },
        template: {
            dir: join(__dirname, '../src/templates/email'),
            adapter: new HandlebarsAdapter(),
            options: {
                strict: true
            }
        }
    }),
    inject: [ConfigService]
}