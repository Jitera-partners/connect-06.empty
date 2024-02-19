
import { IsDateString, IsNotEmpty } from 'class-validator';

export class ValidateTimeEntryDto {
  @IsDateString({}, { message: 'Invalid datetime format.' })
  @IsNotEmpty({ message: 'The check_in cannot be empty.' })
  check_in: string;

  @IsDateString({}, { message: 'Invalid datetime format.' })
  @IsNotEmpty({ message: 'The check_out cannot be empty.' })
  check_out: string;

  constructor(check_in: string, check_out: string) {
    this.check_in = check_in;
    this.check_out = check_out;
  }
}
