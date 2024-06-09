import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { NotionModule } from './notion/notion.module';

@Module({
  imports: [TelegramModule, NotionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
