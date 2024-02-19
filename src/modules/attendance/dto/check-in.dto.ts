import { IsInt, IsDate } from 'class-validator';

export class CheckInDto {
  @IsInt({ message: 'Employee ID must be an integer' })
  employeeId: number;

  @IsDate({ message: 'Date must be a valid date object' })
  date: Date;

  constructor(employeeId: number, date: Date) {
    this.employeeId = employeeId; this.date = date;
  }
}
