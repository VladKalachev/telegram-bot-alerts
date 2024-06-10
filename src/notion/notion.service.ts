import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

@Injectable()
export class NotionService {
  private readonly notion: Client;
  private readonly logger = new Logger(NotionService.name);

  constructor(private readonly configService: ConfigService) {
    const notionToken = this.configService.get<string>('NOTION_API_KEY');
    if (!notionToken) {
      this.logger.error('NOTION_API_KEY is not defined');
      throw new Error('NOTION_API_KEY is not defined');
    }

    this.notion = new Client({ auth: notionToken });
    this.logger.log('Notion client initialized');
    this.getDatabaseEntries();
  }

  async getDatabaseEntries() {
    const databaseId = this.configService.get<string>('NOTION_PAGE_ID');
    if (!databaseId) {
      this.logger.error('NOTION_PAGE_ID is not defined');
      throw new Error('NOTION_PAGE_ID is not defined');
    }

    try {
      const response = await this.notion.databases.query({
        database_id: this.configService.get<string>('NOTION_PAGE_ID'),
      });

      const entries = response.results.map((page) => {
        const properties = (page as any).properties;
        return {
          Name: properties.Name.title[0]?.plain_text,
          Date: properties.Date.date?.start,
        };
      });

      console.log(entries);
    } catch (error) {
      this.logger.error(`Error fetching database entries: ${error.message}`);
      throw error;
    }
  }
}
