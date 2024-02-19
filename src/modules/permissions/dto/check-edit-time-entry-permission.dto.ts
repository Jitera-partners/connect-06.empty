
import { IsNotEmpty, IsInt } from 'class-validator';

export class CheckEditTimeEntryPermissionDto {
  @IsInt({ message: 'User ID must be an integer.' })
  @IsNotEmpty({ message: 'User ID must not be empty.' })
  userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }
}
