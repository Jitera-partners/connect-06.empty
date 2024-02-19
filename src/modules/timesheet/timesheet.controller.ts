import { Controller, Get, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { GetTimeSheetForMonthDto } from './dto/get-time-sheet-for-month.dto';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('api/time-entries')
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getTimeSheetForSelectedMonth(@Query() query: GetTimeSheetForMonthDto) {
    try {
      const { userId, selectedMonth, selectedYear } = query;
      if (!userId || selectedMonth < 1 || selectedMonth > 12 || selectedYear < 1900) {
        throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
      }

      const timeSheet = await this.timesheetService.getTimeSheetForMonth(userId, selectedMonth, selectedYear);
      return {
        status: HttpStatus.OK,
        time_entries: timeSheet.timeEntries,
      };
    } catch (error) {
      if (error.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
