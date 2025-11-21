import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS for Frontend
  app.enableCors({
    origin: 'http://localhost:5173', 
    credentials: true,
  });

  // 2. Global Validation Pipe
  // This ensures all DTOs (Data Transfer Objects) are validated before reaching the controller
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties that are not in the DTO
      forbidNonWhitelisted: true, // Throws error if extra properties are sent
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );

  await app.listen(3000);
}
bootstrap();