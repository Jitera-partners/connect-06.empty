import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TimeEntry } from '../../entities/time_entries';
import { getCurrentMonthAndYear } from '../../utils/date';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { TimeEntryValidator } from '../../shared/validators/time-entry.validator';

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

  async updateTimeEntry(dto: UpdateTimeEntryDto): Promise<TimeEntry> {
    await this.validateTimeEntryData({ id: dto.id, check_in: dto.checkIn, check_out: dto.checkOut });

    const timeEntry = await this.timeEntriesRepository.findOne({
      where: { id: dto.id },
    });

    if (!timeEntry) {
      throw new Error('Time entry not found.');
    }

    if (timeEntry.user_id !== dto.userId) {
      throw new Error('You can only edit your own time entries.');
    }

    timeEntry.check_in_time = dto.checkIn; // Assuming check_in_time is the correct field name
    timeEntry.check_out_time = dto.checkOut; // Assuming check_out_time is the correct field name
    timeEntry.is_edited = true;

    await this.timeEntriesRepository.save(timeEntry);

    return timeEntry;
  }

  // Other methods...
}
