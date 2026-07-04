import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { KafkaConsumerModule } from './kafka/consumer/consumer.module';

@Module({
  imports: [EventsModule, KafkaConsumerModule],
})
export class AppModule {}
