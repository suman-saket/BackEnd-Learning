import { Module } from '@nestjs/common';
import { EventsController } from './controller/events.controller';
import { EventsQueryController } from './controller/events-query.controller';
import { EventsService } from './service/events.service';
import { KafkaProducerModule } from '../kafka/producer/producer.module';
import { KafkaConsumerModule } from '../kafka/consumer/consumer.module';

@Module({
  imports: [KafkaProducerModule, KafkaConsumerModule],
  controllers: [EventsController, EventsQueryController],
  providers: [EventsService],
})
export class EventsModule {}
