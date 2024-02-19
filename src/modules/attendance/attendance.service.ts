import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { AttendanceRecordRepository } from 'src/repositories/attendance-record.repository';
import { AttendanceRecord } from 'src/entities/attendance_records';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AttendanceService {
  constructor(
    private userRepository: UserRepository,
    private attendanceRecordRepository: AttendanceRecordRepository
  ) {}

  async recordCheckOut({ userId, checkOutTime }: { userId: number; checkOutTime: Date }) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User does not exist.');
    }

    const currentDate = new Date().toISOString().slice(0, 10);
    let attendanceRecord = await this.attendanceRecordRepository.findOne({
      where: {
        user_id: userId,
        date: currentDate,
        check_in_time: Not(IsNull()),
        check_out_time: IsNull(),
      },
    });

    if (!attendanceRecord) {
      throw new BadRequestException('Employee has not checked in today.');
    }

    attendanceRecord.check_out_time = checkOutTime;
    await this.attendanceRecordRepository.save(attendanceRecord);

    // Log the check-out action for auditing purposes
    console.log(`User ID: ${userId} checked out at: ${checkOutTime}`);

    return {
      message: 'Check-out recorded successfully.',
      userId: userId,
      checkOutTime: checkOutTime,
    };
  }
}
