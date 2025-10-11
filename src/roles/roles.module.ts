import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './model/role.model';
import { StaffRole } from '../staff_roles/model/staff_role.model';

@Module({
  imports: [SequelizeModule.forFeature([Role, StaffRole])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule { }
