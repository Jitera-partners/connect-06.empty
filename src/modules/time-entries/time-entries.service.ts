import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeEntry } from '../../entities/time_entries';
import { getCurrentMonthAndYear } from '../../utils/date';

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
}
