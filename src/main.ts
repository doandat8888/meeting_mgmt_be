import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors();
  // Enable CORS with specific settings
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow credentials (cookies, headers)
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT || 8000);
}
bootstrap();
