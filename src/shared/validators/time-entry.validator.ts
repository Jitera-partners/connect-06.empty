export class TimeEntryValidator {
  static validateDateTimeFormat(check_in: string, check_out: string): boolean {
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return false;
    }
    return true;
  }

  static validateCheckInBeforeCheckOut(check_in: Date, check_out: Date): boolean {
    return check_in < check_out;
  }

  static validateTimeEntryData(id: number, check_in: string, check_out: string): string {
    if (!this.validateDateTimeFormat(check_in, check_out)) {
      return 'Error: Invalid datetime format for check-in or check-out.';
    }

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    if (!this.validateCheckInBeforeCheckOut(checkInDate, checkOutDate)) {
      return 'Error: Check-in time must be before check-out time.';
    }

    return 'Time entry data is valid.';
  }
}
