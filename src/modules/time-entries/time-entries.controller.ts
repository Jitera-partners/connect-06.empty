import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { TimeEntriesService } from './time-entries.service';
import { GetCurrentMonthTimeEntriesDto } from './dto/get-current-month-time-entries.dto';
import { TimeEntry } from '../../entities/time_entries';

@Controller()
export class TimeEntriesController {
  constructor(private readonly timeEntriesService: TimeEntriesService) {}

  @Get('/api/time-entries/current-month')
  @UseGuards(AuthGuard)
  async getCurrentMonthTimeEntries(@Query() query: GetCurrentMonthTimeEntriesDto): Promise<{ status: number; time_entries: TimeEntry[] }> {
    try {
      const { userId } = query;
      const result = await this.timeEntriesService.getCurrentMonthTimeEntries(userId);
      return {
        status: HttpStatus.OK,
        time_entries: result.timeEntries.map(entry => ({
          id: entry.id,
          check_in_time: entry.check_in_time.toISOString(),
          check_out_time: entry.check_out_time.toISOString(),
          total_hours: entry.total_hours,
          day_type: entry.day_type,
          entry_date: entry.entry_date.toISOString().split('T')[0],
        })),
      };
    } catch (error) {
      if (error.name === 'EntityNotFound') {
        throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('An unexpected error occurred on the server.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
