import { HealthCheckModule } from './health-check/health-check.module';
import { AttendanceModule } from './attendance/attendance.module';
import { TimeEntriesModule } from './time-entries/time-entries.module';
import { PermissionsModule } from './permissions/permissions.module';

export default [HealthCheckModule, AttendanceModule, PermissionsModule, TimeEntriesModule];
