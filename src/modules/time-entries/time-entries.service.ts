
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm'; // Added Between import
import { TimeEntry } from '../../entities/time_entries';
import { getCurrentMonthAndYear } from '../../utils/date';
import { TimeEntryValidator } from '../../shared/validators/time-entry.validator'; // Added import for TimeEntryValidator

@Injectable()
export class TimeEntriesService {
  constructor(
    @InjectRepository(TimeEntry)
    private timeEntriesRepository: Repository<TimeEntry>,
  ) {}

  async getCurrentMonthTimeEntries(userId: number): Promise<{ timeEntries: TimeEntry[]; totalHours: number; totalDays: number }> {
    const { currentMonth, currentYear } = getCurrentMonthAndYear();
    const timeEntries = await this.timeEntriesRepository.find({
      where: {
        user_id: userId,
        entry_date: Between(
          new Date(currentYear, currentMonth - 1, 1),
          new Date(currentYear, currentMonth, 0)
        ),
      },
    });

    let totalHours = 0;
    timeEntries.forEach(entry => {
      if (!entry.total_hours) {
        entry.total_hours = (entry.check_out_time.getTime() - entry.check_in_time.getTime()) / (1000 * 60 * 60);
      }
      totalHours += entry.total_hours;
    });

    const totalDays = new Set(timeEntries.map(entry => entry.entry_date.toISOString().split('T')[0])).size;

    return { timeEntries, totalHours, totalDays };
  }

  async validateTimeEntryData({ id, check_in, check_out }: { id: number; check_in: Date; check_out: Date }): Promise<{ message: string }> {
    const validator = new TimeEntryValidator();

    // Validate datetime format
    if (!validator.isDateTimeFormat(check_in) || !validator.isDateTimeFormat(check_out)) {
      throw new Error('Invalid datetime format for check-in or check-out.');
    }

    // Validate check_in is before check_out
    if (!validator.isCheckInBeforeCheckOut(check_in, check_out)) {
      throw new Error('Check-in time must be before check-out time.');
    }

    // If all validations pass
    return { message: 'Time entry data is valid.' };
  }

  // Other methods...
}
