import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StaffRolesService } from './staff_roles.service';
import { CreateStaffRoleDto } from './dto/create-staff_role.dto';
import { UpdateStaffRoleDto } from './dto/update-staff_role.dto';

@Controller('staff-roles')
export class StaffRolesController {
  constructor(private readonly staffRolesService: StaffRolesService) {}

  @Post()
  create(@Body() createStaffRoleDto: CreateStaffRoleDto) {
    return this.staffRolesService.create(createStaffRoleDto);
  }

  @Get()
  findAll() {
    return this.staffRolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffRolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffRoleDto: UpdateStaffRoleDto) {
    return this.staffRolesService.update(+id, updateStaffRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffRolesService.remove(+id);
  }
}
