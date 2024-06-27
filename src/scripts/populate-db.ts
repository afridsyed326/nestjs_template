import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { runPropertiesScript } from './properties.script';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  await runPropertiesScript(appContext);
}

bootstrap().catch((err) => {
  console.error('Error populating database:', err);
  process.exit(1);
});
