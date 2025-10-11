import { PartialType } from '@nestjs/swagger';
import { CreateStaffRoleDto } from './create-staff_role.dto';

export class UpdateStaffRoleDto extends PartialType(CreateStaffRoleDto) {}
