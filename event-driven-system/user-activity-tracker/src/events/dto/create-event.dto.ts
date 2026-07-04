import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateEventDto {
  @IsString()
  eventType: string;

  @IsString()
  sessionId: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  eventId?: string;

  @IsOptional()
  @IsString()
  timestamp?: string;

  @IsOptional()
  @IsObject()
  properties?: Record<string, any>;
}
