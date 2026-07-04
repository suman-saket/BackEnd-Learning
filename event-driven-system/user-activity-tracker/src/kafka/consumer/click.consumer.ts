import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import { consumerGroups, kafkaConfig } from '../kafka.config';
import { parseEvent } from './parse-event';

@Injectable()
export class ClickConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ClickConsumer.name);
  private consumer: Consumer;

  async onModuleInit(): Promise<void> {
    const kafka = new Kafka({
      clientId: 'click-consumer',
      brokers: [kafkaConfig.broker],
    });

    this.consumer = kafka.consumer({ groupId: consumerGroups.click });

    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: kafkaConfig.eventsTopic,
      fromBeginning: kafkaConfig.consumerFromBeginning,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const event = parseEvent(message.value);
        if (!event || event.eventType !== 'click') return;

        this.logger.log(
          `Click | eventId=${event.eventId} | session=${event.sessionId} | button=${event.properties?.buttonId}`,
        );
      },
    });

    this.logger.log(`Subscribed to ${kafkaConfig.eventsTopic} [${consumerGroups.click}]`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
  }
}
