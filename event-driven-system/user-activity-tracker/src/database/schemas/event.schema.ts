import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<EventRecord>;

@Schema({ collection: 'events', timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } })
export class EventRecord {
  @Prop({ required: true, unique: true, index: true })
  eventId: string;

  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop()
  userId?: string;

  @Prop({ default: 'API' })
  source: string;

  @Prop({ required: true })
  publishedDate: Date;

  @Prop({ type: Object, default: {} })
  additionalEventAttributes: Record<string, unknown>;
}

export const EventSchema = SchemaFactory.createForClass(EventRecord);
