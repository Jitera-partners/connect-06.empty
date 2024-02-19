 { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { AttendanceRecordRepository } from 'src/repositories/attendance-record.repository';
import { AttendanceRecord } from 'src/entities/attendance_records';
import { BadRequestException } from '@nestjs/common';
import { Not, IsNull } from 'typeorm';

@Injectable()
export class AttendanceService {
  constructor(
    private userRepository: UserRepository,
    private attendanceRecordRepository: AttendanceRecordRepository
  ) {}

  async recordCheckOut({ userId, checkOutTime }: { userId: number; checkOutTime: Date }) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const currentDate = new Date().toISOString().slice(0, 10);
    let attendanceRecord = await this.attendanceRecordRepository.findOne({
      where: {
        user_id: userId,
        date: currentDate,
        check_in_time: Not(IsNull()),
        check_out_time: IsNull(),
      },
    }).catch(() => { throw new BadRequestException('Invalid user ID format.'); });

    if (!attendanceRecord) {
      throw new BadRequestException('Employee has not checked in today.');
    }

    attendanceRecord.check_out_time = checkOutTime;
    await this.attendanceRecordRepository.save(attendanceRecord);
    
    const response = {
      status: 200,
      message: 'Check-out recorded successfully.',
      attendance_record: {
        id: attendanceRecord.id,
        user_id: userId,
        check_in_time: attendanceRecord.check_in_time,
        check_out_time: attendanceRecord.check_out_time,
        date: attendanceRecord.date
      }
    };

    return response;
  }
}
