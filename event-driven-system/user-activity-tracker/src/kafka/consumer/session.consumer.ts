import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import { consumerGroups, kafkaConfig } from '../kafka.config';
import { UserEvent } from '../types/user-event.interface';
import { EventsPersistenceService } from './events-persistence.service';
import { parseEvent } from './parse-event';

@Injectable()
export class SessionConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SessionConsumer.name);
  private consumer: Consumer;
  private readonly sessionEventCounts = new Map<string, number>();

  constructor(private readonly eventsPersistence: EventsPersistenceService) {}

  async onModuleInit(): Promise<void> {
    const kafka = new Kafka({
      clientId: 'session-consumer',
      brokers: [kafkaConfig.broker],
    });

    this.consumer = kafka.consumer({ groupId: consumerGroups.session });

    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: kafkaConfig.eventsTopic,
      fromBeginning: kafkaConfig.consumerFromBeginning,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const event = parseEvent(message.value);
        if (!event) return;

        await this.trackSessionEvent(event);
      },
    });

    this.logger.log(`Subscribed to ${kafkaConfig.eventsTopic} [${consumerGroups.session}]`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
  }

  private async trackSessionEvent(event: UserEvent): Promise<void> {
    await this.eventsPersistence.saveEvent(event);

    const count = (this.sessionEventCounts.get(event.sessionId) ?? 0) + 1;
    this.sessionEventCounts.set(event.sessionId, count);

    this.logger.log(
      `Session | session=${event.sessionId} | type=${event.eventType} | eventsInSession=${count}`,
    );
  }
}
