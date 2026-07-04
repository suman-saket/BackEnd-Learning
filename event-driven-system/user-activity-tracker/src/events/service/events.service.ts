import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateEventDto } from '../dto/create-event.dto';
import { KafkaProducerService } from '../../kafka/producer/producer.service';
import { UserEvent } from '../../kafka/types/user-event.interface';

@Injectable()
export class EventsService {
  constructor(private readonly kafkaProducer: KafkaProducerService) {}

  async createEvent(dto: CreateEventDto): Promise<{ eventId: string; status: string }> {
    const event: UserEvent = {
      ...dto,
      eventId: dto.eventId ?? randomUUID(),
      timestamp: dto.timestamp ?? new Date().toISOString(),
    };

    await this.kafkaProducer.publishEvent(event.sessionId, event);

    return { eventId: event.eventId!, status: 'accepted' };
  }
}
