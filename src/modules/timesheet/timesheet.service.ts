import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeEntry } from 'src/entities/time_entries';
import { BaseRepository } from 'src/shared/base.repository';
import { MoreThanOrEqual, LessThan } from 'typeorm';

@Injectable()
export class TimesheetService {
  constructor(
    @InjectRepository(TimeEntry)
    private timeEntriesRepository: BaseRepository<TimeEntry>,
  ) {}

  async getTimeSheetForMonth(userId: number, selectedMonth: number, selectedYear: number) {
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0);

    const timeEntries = await this.timeEntriesRepository.find({
      where: {
        user_id: userId,
        entry_date: MoreThanOrEqual(startDate),
        entry_date: LessThan(endDate),
      },
    });

    let totalHours = 0;
    let totalDays = 0;
    const entriesWithTotalHours = timeEntries.map(entry => {
      const checkIn = new Date(entry.check_in_time);
      const checkOut = new Date(entry.check_out_time);
      const hoursWorked = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
      totalHours += hoursWorked;
      totalDays += 1;
      return {
        ...entry,
        total_hours: entry.total_hours || hoursWorked,
      };
    });

    return {
      timeEntries: entriesWithTotalHours,
      totalHours,
      totalDays,
    };
  }
}
