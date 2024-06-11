import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
@Update()
export class TelegramService {
  private scheduledMessages: Set<string> = new Set();
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly configService: ConfigService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply(`Привет, ${ctx.message.from.first_name}!`);
  }

  async sendMessage(chatId: string, text: string) {
    try {
      await this.bot.telegram.sendMessage(chatId, text);
    } catch (error) {
      console.error('Error sending Telegram message', error);
    }
  }

  async scheduleMessage(text: string, date: string, id: string) {
    // const targetDate = new Date(date);

    // const delay = targetDate.getTime() - Date.now();

    // console.log('delay', id, delay);

    // if (delay > 0) {
    // setTimeout(async () => {
    const chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
    await this.sendMessage(chatId, text);
    this.scheduledMessages.delete(id);
    this.logger.log(`Scheduled message sent: ${text} at ${date}`);
    // }, delay);

    this.scheduledMessages.add(id);
    this.logger.log(`Message scheduled: ${text} at ${date}`);
    // } else {
    //   this.logger.warn(`Scheduled date ${date} is in the past. Skipping.`);
    // }
  }

  async getScheduledMessages(): Promise<string[]> {
    return Array.from(this.scheduledMessages);
  }
}
