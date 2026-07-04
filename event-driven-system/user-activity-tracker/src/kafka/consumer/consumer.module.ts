import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ClickConsumer } from './click.consumer';
import { EventsPersistenceService } from './events-persistence.service';
import { PageViewConsumer } from './page-view.consumer';
import { SessionConsumer } from './session.consumer';

@Module({
  imports: [DatabaseModule],
  providers: [PageViewConsumer, ClickConsumer, SessionConsumer, EventsPersistenceService],
  exports: [EventsPersistenceService],
})
export class KafkaConsumerModule {}
