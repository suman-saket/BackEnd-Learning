import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { kafkaConfig } from '../kafka.config';
import { UserEvent } from '../types/user-event.interface';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private readonly kafka = new Kafka({
    clientId: kafkaConfig.producerClientId,
    brokers: [kafkaConfig.broker],
  });
  private producer: Producer;

  async onModuleInit(): Promise<void> {
    this.producer = this.kafka.producer();
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
    this.logger.log('Kafka producer disconnected');
  }

  async publishEvent(sessionId: string, event: UserEvent): Promise<void> {
    await this.producer.send({
      topic: kafkaConfig.eventsTopic,
      messages: [
        {
          key: sessionId,
          value: JSON.stringify(event),
        },
      ],
    });

    this.logger.log(
      `Published ${event.eventType} | eventId=${event.eventId} | session=${sessionId}`,
    );
  }
}
