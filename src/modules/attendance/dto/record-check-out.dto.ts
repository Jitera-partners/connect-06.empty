import { IsInt, IsDate } from 'class-validator';

export class RecordCheckOutDto {
  @IsInt({ message: 'Invalid user ID format.' })
  userId: number;

  @IsDate({ message: 'Check-out time must be a valid date' })
  checkOutTime: Date;

  constructor(userId: number, checkOutTime: Date) {
    this.userId = userId; this.checkOutTime = checkOutTime;
  }
}
