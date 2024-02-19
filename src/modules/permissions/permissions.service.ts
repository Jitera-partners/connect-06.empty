
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from 'src/entities/permissions';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async checkEditTimeEntryPermission(userId: number): Promise<boolean> {
    try {
      const permission = await this.permissionsRepository.findOne({
        where: { user_id: userId },
      });

      if (!permission) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      if (!permission.can_edit_time_entries) {
        throw new HttpException('User does not have permission to edit time entries.', HttpStatus.FORBIDDEN);
      }

      return true;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
