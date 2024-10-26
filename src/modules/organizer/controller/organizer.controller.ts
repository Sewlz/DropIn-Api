import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrganizerService } from '../service/organizer.service';
import { CreateOrganizerDto } from '../dto/create-organizer-dto';

@Controller('organizer')
export class OrganizerController {
  constructor(private readonly organizerService: OrganizerService) {}
  @Get()
  async getAllOrganizer() {
    return this.organizerService.getAllOrganizer();
  }
  @Get()
  async getOrganizerId(@Body() id: string) {
    return this.organizerService.getOrganizerById(id);
  }
  @Post()
  async createOrganizer(@Body() createOrganizerDto: CreateOrganizerDto) {
    return this.organizerService.createOrganizer(createOrganizerDto);
  }
}
