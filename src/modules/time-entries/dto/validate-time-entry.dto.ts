import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class ValidateTimeEntryDto {
  @IsInt()
  @IsNotEmpty({ message: 'The id must be an integer and cannot be empty.' })
  id: number;

  @IsDateString({}, { message: 'The check_in must be a valid datetime string.' })
  @IsNotEmpty({ message: 'The check_in cannot be empty.' })
  check_in: string;

  @IsDateString({}, { message: 'The check_out must be a valid datetime string.' })
  @IsNotEmpty({ message: 'The check_out cannot be empty.' })
  check_out: string;

  constructor(id: number, check_in: string, check_out: string) {
    this.id = id;
    this.check_in = check_in;
    this.check_out = check_out;
  }
}
