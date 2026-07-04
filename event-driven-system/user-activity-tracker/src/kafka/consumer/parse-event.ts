import { UserEvent } from '../types/user-event.interface';

export function parseEvent(raw: Buffer | null): UserEvent | null {
  if (!raw) return null;

  try {
    const event = JSON.parse(raw.toString()) as UserEvent;
    if (!event.eventType || !event.sessionId) return null;
    return event;
  } catch {
    return null;
  }
}
