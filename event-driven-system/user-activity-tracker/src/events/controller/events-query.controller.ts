import { Controller, Get, Query } from '@nestjs/common';
import { EventsPersistenceService } from '../../kafka/consumer/events-persistence.service';

@Controller()
export class EventsQueryController {
  constructor(private readonly eventsPersistence: EventsPersistenceService) {}

  @Get('events')
  async getRecentEvents(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50;
    return this.eventsPersistence.findRecent(parsedLimit);
  }
}
