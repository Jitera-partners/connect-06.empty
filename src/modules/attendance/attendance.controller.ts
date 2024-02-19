
import {
  Body,
  Put,
  Controller,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { RecordCheckOutDto } from './dto/record-check-out.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('api/attendance')
@ApiTags('Attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Put('check-out')
  @UseGuards(AuthGuard)
  async checkOut(@Body() recordCheckOutDto: RecordCheckOutDto) {
    try {
      const result = await this.attendanceService.recordCheckOut(recordCheckOutDto);
      return result;
    } catch (error) {
      if (error.status === HttpStatus.UNAUTHORIZED) {
        throw new HttpException({
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
        }, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
