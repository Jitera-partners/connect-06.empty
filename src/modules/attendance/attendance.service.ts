import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/entities/employees';
import { AttendanceRecord } from 'src/entities/attendance_records';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(AttendanceRecord)
    private attendanceRecordRepository: Repository<AttendanceRecord>,
  ) {}

  async checkInEmployee(employeeId: number, date: Date): Promise<{ message: string; checkInTime?: Date }> {
    const employee = await this.employeeRepository.findOneBy({ id: employeeId });

    if (!employee || !employee.logged_in) {
      return { message: 'Employee is not logged in or does not exist.' };
    }

    const attendanceRecord = await this.attendanceRecordRepository.findOne({
      where: {
        employee_id: employeeId,
        date: date,
      },
    });

    if (attendanceRecord) {
      return { message: 'Employee has already checked in for the current date.' };
    }

    const checkInTime = new Date();
    const newAttendanceRecord = this.attendanceRecordRepository.create({
      employee_id: employeeId,
      date: date,
      check_in_time: checkInTime,
    });

    await this.attendanceRecordRepository.save(newAttendanceRecord);

    return { message: 'Check-in recorded successfully.', checkInTime: checkInTime };
  }
}
