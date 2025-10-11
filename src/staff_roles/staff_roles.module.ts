import { Module } from '@nestjs/common';
import { StaffRolesService } from './staff_roles.service';
import { StaffRolesController } from './staff_roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { StaffRole } from './model/staff_role.model';
import { Staff } from '../staffs/model/staff.model';
import { Role } from '../roles/model/role.model';

@Module({
  imports: [SequelizeModule.forFeature([StaffRole, Staff, Role])],
  controllers: [StaffRolesController],
  providers: [StaffRolesService],
})
export class StaffRolesModule {}
