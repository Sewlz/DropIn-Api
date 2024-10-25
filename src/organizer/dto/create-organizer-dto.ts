export class CreateOrganizerDto {
  name: string;
  logoUrl?: string;
  contactDetails: { phone: string; email: string };
}
