import { IsInt, IsNotEmpty, Min, Max, IsPositive } from 'class-validator';

export class GetTimeSheetForMonthDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(12)
  selectedMonth: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  selectedYear: number;

  constructor(userId: number, selectedMonth: number, selectedYear: number) {
    this.userId = userId;
    this.selectedMonth = selectedMonth;
    this.selectedYear = selectedYear;
  }
}
