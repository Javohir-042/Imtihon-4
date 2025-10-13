import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorator/roles.decorator';
import { Role } from '../common/enum/admin.enum';

@ApiTags('Prescriptions - Dori retseptlari')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.DOCTORS)
  @Post()
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(createPrescriptionDto);
  }


  @Roles(Role.DOCTORS, Role.SUPERADMIN, Role.ADMIN)
  @Get()
  findAll() {
    return this.prescriptionsService.findAll();
  }

  @Roles(Role.DOCTORS, Role.SUPERADMIN, Role.ADMIN, "ID")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(+id);
  }

  @Roles(Role.DOCTORS, Role.SUPERADMIN, Role.ADMIN, "ID")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrescriptionDto: UpdatePrescriptionDto) {
    return this.prescriptionsService.update(+id, updatePrescriptionDto);
  }

  @Roles(Role.DOCTORS, Role.SUPERADMIN, Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prescriptionsService.remove(+id);
  }
}
