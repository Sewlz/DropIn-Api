export class CreateBookingDto {
  event: string;
  user: string;
  seats: { seatNumber: string; ticketType: string }[];
  totalAmount: number;
  paymentStatus?: 'pending' | 'completed' | 'canceled';
}
