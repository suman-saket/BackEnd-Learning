import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventRecord, EventSchema } from './schemas/event.schema';

const mongoUri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/activity-tracker';

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
    MongooseModule.forFeature([{ name: EventRecord.name, schema: EventSchema }]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
