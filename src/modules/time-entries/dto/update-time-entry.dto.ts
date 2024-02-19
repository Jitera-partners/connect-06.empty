import { IsInt, IsDate } from 'class-validator';

export class UpdateTimeEntryDto {
  @IsInt()
  id: number;

  @IsInt()
  userId: number;

  @IsDate()
  checkIn: Date;

  @IsDate()
  checkOut: Date;
}
