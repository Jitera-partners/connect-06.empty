import {
  Body,
  UseGuards,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in.dto';
import { RecordCheckOutDto } from './dto/record-check-out.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('api/attendance')
@ApiTags('Attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(AuthGuard)
  async checkIn(@Body() checkInDto: CheckInDto) {
    try {
      const result = await this.attendanceService.checkInEmployee(checkInDto.employeeId, new Date());
      if (result.message === 'Employee has already checked in for the current date.') {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: result.message,
        }, HttpStatus.BAD_REQUEST);
      }
      return {
        status: HttpStatus.OK,
        message: "Check-in successful",
        attendance_record: {
          id: result.attendanceRecord.id,
          employee_id: checkInDto.employeeId,
          check_in_time: result.checkInTime,
          date: result.checkInTime.toISOString().split('T')[0]
        }
      };
    } catch (error) {
      throw new HttpException({
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.response || error.message,
      }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('check-out')
  async checkOut(@Body() recordCheckOutDto: RecordCheckOutDto) {
    try {
      const result = await this.attendanceService.recordCheckOut(recordCheckOutDto);
      return result;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
