import {
  Controller,
  Put,
  Post,
  Get,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  Body,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { GetCurrentMonthTimeEntriesDto } from './dto/get-current-month-time-entries.dto';
import { TimeEntriesService } from './time-entries.service';
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

  @Put('/api/time-entries/:id')
  @UseGuards(AuthGuard)
  async updateTimeEntry(@Param('id') id: number, @Body() updateDto: UpdateTimeEntryDto) {
    try {
      const updatedEntry = await this.timeEntriesService.updateTimeEntry({ ...updateDto, id });
      return {
        status: HttpStatus.OK,
        time_entry: {
          id: updatedEntry.id,
          user_id: updatedEntry.user_id,
          check_in: updatedEntry.check_in_time.toISOString(),
          check_out: updatedEntry.check_out_time.toISOString(),
          date: updatedEntry.entry_date.toISOString().split('T')[0],
          is_edited: updatedEntry.is_edited,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/api/time-entries/validate')
  @UseGuards(AuthGuard)
  async validateTimeEntry(@Body() body: { check_in: string; check_out: string }): Promise<{ status: number; message: string }> {
    try {
      const { check_in, check_out } = body;
      await this.timeEntriesService.validateTimeEntryData({ check_in: new Date(check_in), check_out: new Date(check_out) });
      return {
        status: HttpStatus.OK,
        message: "Time entry data is valid."
      };
    } catch (error) {
      if (error.message.includes('Invalid datetime format')) {
        throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
