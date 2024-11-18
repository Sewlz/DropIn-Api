import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Put,
  Request,
  Delete,
} from '@nestjs/common';
import { TicketService } from '../service/ticket.service';
import { TicketDto } from '../dto/ticket.dto';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { Roles } from '../../auth/roles/decorator/role.decorator';
import { Role } from '../../auth/roles/enum/role.enum';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}
  @Get('/:eventId')
  async getEventTicket(@Param('eventId') id: string) {
    return this.ticketService.getTicketByEventId(id);
  }
  @Post('/create')
  @UseGuards(AuthGuard)
  async createTicket(@Body() createTicketDto: TicketDto) {
    return this.ticketService.createTicket(createTicketDto);
  }
  @Put('/update/:id')
  @UseGuards(AuthGuard)
  async updateTicket(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateTicketDto: TicketDto,
  ) {
    const userId = req.user.sub;
    return this.ticketService.updateTicket(userId, id, updateTicketDto);
  }
  @Delete('/delete/:id')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  async deleteTicket(@Param('id') id: string) {
    return this.ticketService.deleteTicketById(id);
  }
}
