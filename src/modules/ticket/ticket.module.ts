import { Module } from '@nestjs/common';
import { TicketService } from './service/ticket.service';
import { TicketController } from './controller/ticket.controller';

@Module({
  providers: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}
