import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { RecordCheckOutDto } from './dto/record-check-out.dto';

@Controller('api/attendance')
@ApiTags('Attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

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
