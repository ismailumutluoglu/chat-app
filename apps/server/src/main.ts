import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // DTO validasyonunu aktif et
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // DTO'da olmayan alanları sil
      forbidNonWhitelisted: true, // DTO'da olmayan alan gelirse hata fırlat
      transform: true,        // string'leri otomatik tipe dönüştür
    }),
  );

  // CORS — frontend'den istek gelebilsin
  app.enableCors({
    origin: 'http://localhost:5173', // Vite'nin default portu
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Uygulama çalışıyor: http://localhost:${port}`);
}

bootstrap();