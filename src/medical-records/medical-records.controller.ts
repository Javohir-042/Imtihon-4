import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { MedicalRecordsService } from "./medical-records.service";
import { CreateMedicalRecordDto } from "./dto/create-medical-record.dto";
import { UpdateMedicalRecordDto } from "./dto/update-medical-record.dto";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "../common/guards/auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorator/roles.decorator";
import { Role } from "../common/enum/admin.enum";

@ApiTags("Medical Records - Tibbiy qaydlar")
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller("medical_records")
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) { }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTORS)
  @ApiOperation({ summary: "Yangi tibbiy yozuv yaratish" })
  @Post()
  create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(createMedicalRecordDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTORS)
  @ApiOperation({ summary: "Barcha tibbiy yozuvlarni olish" })
  @Get()
  findAll() {
    return this.medicalRecordsService.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTORS)
  @ApiOperation({ summary: "Id bo'yicha tibbiy yozuvni olish" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.medicalRecordsService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: "Tibbiy yozuvni yangilash" })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateMedicalRecordDto: UpdateMedicalRecordDto) {
    return this.medicalRecordsService.update(+id, updateMedicalRecordDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: "Tibbiy yozuvni o'chirish" })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.medicalRecordsService.remove(+id);
  }
}
