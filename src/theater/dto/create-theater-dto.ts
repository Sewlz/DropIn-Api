export class CreateTheaterDto {
  name: string;
  address: string;
  seats: { seatNumber: string; type: string; status: string }[];
}
