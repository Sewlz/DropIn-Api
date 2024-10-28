import { Module } from '@nestjs/common';
import { TicketController } from './controller/ticket.controller';
import { TicketService } from './service/ticket.service';

@Module({
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
