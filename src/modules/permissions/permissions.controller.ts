import { Controller, Get, Param, ParseIntPipe, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../entities/users';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller()
export class PermissionsController {
  constructor(
    private permissionsService: PermissionsService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Get('/api/time-entries/permissions/:user_id')
  @UseGuards(AuthGuard)
  async checkEditTimeEntryPermission(@Param('user_id', ParseIntPipe) userId: number) {
    try {
      const userExists = await this.userRepository.findOneBy({ id: userId });
      if (!userExists) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      const canEdit = await this.permissionsService.checkEditTimeEntryPermission(userId);
      return {
        status: HttpStatus.OK,
        can_edit_time_entries: canEdit,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('An unexpected error occurred on the server.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
