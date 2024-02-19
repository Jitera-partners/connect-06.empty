import { Injectable } from '@nestjs/common';
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
    const permission = await this.permissionsRepository.findOne({
      where: { user_id: userId },
    });

    if (!permission || !permission.can_edit_time_entries) {
      throw new Error('User is not authorized to edit time entries.');
    }

    return true;
  }
}
