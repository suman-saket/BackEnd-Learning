import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import { consumerGroups, kafkaConfig } from '../kafka.config';
import { parseEvent } from './parse-event';

@Injectable()
export class PageViewConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PageViewConsumer.name);
  private consumer: Consumer;

  async onModuleInit(): Promise<void> {
    const kafka = new Kafka({
      clientId: 'page-view-consumer',
      brokers: [kafkaConfig.broker],
    });

    this.consumer = kafka.consumer({ groupId: consumerGroups.pageView });

    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: kafkaConfig.eventsTopic,
      fromBeginning: kafkaConfig.consumerFromBeginning,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const event = parseEvent(message.value);
        if (!event || event.eventType !== 'page_view') return;

        this.logger.log(
          `Page view | eventId=${event.eventId} | session=${event.sessionId} | path=${event.properties?.path}`,
        );
      },
    });

    this.logger.log(`Subscribed to ${kafkaConfig.eventsTopic} [${consumerGroups.pageView}]`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
  }
}
