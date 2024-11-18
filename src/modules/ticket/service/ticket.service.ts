import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ticket } from '../schema/ticket.schema';
import { TicketDto } from '../dto/ticket.dto';
@Injectable()
export class TicketService {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<Ticket>) {}
  async getTicketById(id: string): Promise<Ticket> {
    try {
      return this.ticketModel.findById(id).exec();
    } catch (error) {
      throw new Error(`Failed to get Event: ${error}`);
    }
  }
  async getAllUserTicket(userId: string): Promise<Ticket[]> {
    try {
      const tickets: Ticket[] = await this.ticketModel.find({ userId }).exec();
      return tickets;
    } catch (error) {
      throw new Error(`Failed to get Event: ${error}`);
    }
  }
  async createTicket(createTicketDto: TicketDto): Promise<Ticket> {
    if (!createTicketDto) {
      throw new Error('createTicketDto is null or undefined');
    }
    try {
      const createdTicket = new this.ticketModel(createTicketDto);
      return createdTicket.save();
    } catch (error) {
      throw new Error(`Failed to create event: ${error}`);
    }
  }
  async updateTicket(
    userId: string,
    ticketId: string,
    updateTicketDto: TicketDto,
  ) {
    if (!userId || !ticketId) {
      throw new Error('Ticket id is null or undefined');
    }
    try {
      const formattedTicketId = new Types.ObjectId(ticketId);
      const formattedUserId = new Types.ObjectId(userId);
      const updatedTicket = await this.ticketModel
        .findOneAndUpdate(
          {
            _id: formattedTicketId,
            userId: formattedUserId,
          },
          { $set: updateTicketDto },
          { new: true },
        )
        .exec();
      return updatedTicket;
    } catch (error) {
      throw new Error(`Failed to update event: ${error}`);
    }
  }
  //   async deleteTicketByUserId(userId: string) {
  //     try {
  //       const formattedUserId = new Types.ObjectId(userId);
  //       const deletedTicket = await this.ticketModel
  //         .deleteMany({ userId: formattedUserId })
  //         .exec();
  //       return deletedTicket;
  //     } catch (error) {
  //       throw new Error(`Failed to delete event: ${error}`);
  //     }
  //   }
  //   async deleteTicket(userId: string, ticketId: string) {
  //     if (!userId || !ticketId) {
  //       throw new Error('Ticket id is null or undefined');
  //     }
  //     try {
  //       const formattedTicketId = new Types.ObjectId(ticketId);
  //       const formattedUserId = new Types.ObjectId(userId);
  //       const deletedTicket = await this.ticketModel
  //         .findOneAndDelete({
  //           _id: formattedTicketId,
  //           userId: formattedUserId,
  //         })
  //         .exec();
  //       return deletedTicket;
  //     } catch (error) {
  //       throw new Error(`Failed to delete event: ${error}`);
  //     }
  //   }
  //   async deleteTicketByEventId(eventId: string) {
  //     try {
  //       const formattedEventId = new Types.ObjectId(eventId);
  //       const deletedTicket = await this.ticketModel
  //         .deleteMany({ eventId: formattedEventId })
  //         .exec();
  //       return deletedTicket;
  //     } catch (error) {
  //       throw new Error(`Failed to delete event: ${error}`);
  //     }
  //   }
  async deleteTicketById(id: string) {
    try {
      return this.ticketModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(`Failed to delete event: ${error}`);
    }
  }
}
