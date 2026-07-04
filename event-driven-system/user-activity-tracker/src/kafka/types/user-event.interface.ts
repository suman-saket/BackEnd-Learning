export interface UserEvent {
  eventId?: string;
  eventType: string;
  sessionId: string;
  userId?: string;
  timestamp?: string;
  properties?: Record<string, unknown>;
}
