
import { Module } from '@nestjs/common';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from './timesheet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntry } from 'src/entities/time_entries';

@Module({
  imports: [TypeOrmModule.forFeature([TimeEntry])],
  controllers: [TimesheetController],
  providers: [TimesheetService],
})
export class TimesheetModule {}
