import { IsNumber } from 'class-validator';

export class GetCurrentMonthTimeEntriesDto {
  @IsNumber()
  userId: number;
}

