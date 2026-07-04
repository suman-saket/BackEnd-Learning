import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventRecord } from '../../database/schemas/event.schema';
import { UserEvent } from '../types/user-event.interface';

@Injectable()
export class EventsPersistenceService {
  private readonly logger = new Logger(EventsPersistenceService.name);

  constructor(
    @InjectModel(EventRecord.name) private readonly eventModel: Model<EventRecord>,
  ) {}

  async saveEvent(event: UserEvent): Promise<void> {
    if (!event.eventId) {
      this.logger.warn('Skipping event without eventId');
      return;
    }

    const publishedDate = event.timestamp ? new Date(event.timestamp) : new Date();

    try {
      await this.eventModel.findOneAndUpdate(
        { eventId: event.eventId },
        {
          eventId: event.eventId,
          eventName: event.eventType,
          sessionId: event.sessionId,
          userId: event.userId,
          source: 'API',
          publishedDate,
          additionalEventAttributes: event.properties ?? {},
        },
        { upsert: true, new: true },
      );

      this.logger.log(`Saved event ${event.eventId} (${event.eventType})`);
    } catch (error) {
      this.logger.error(`Failed to save event ${event.eventId}`, error);
      throw error;
    }
  }

  async findRecent(limit = 50): Promise<EventRecord[]> {
    return this.eventModel.find().sort({ publishedDate: -1 }).limit(limit).lean();
  }
}
