import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { EventsService } from '../service/events.service';
import { CreateEventDto } from '../../events/dto/create-event.dto';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('add/event')
  @HttpCode(HttpStatus.ACCEPTED)
  async createEvent(@Body() event: CreateEventDto) {
    return await this.eventsService.createEvent(event);
  }
}
