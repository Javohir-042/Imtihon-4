import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { PatientsService } from "./patients.service";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";
import { AuthGuard } from "../common/guards/auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorator/roles.decorator";
import { Role } from "../common/enum/admin.enum";

@ApiTags("Patients - Bemorlar")
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller("patients")
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) { }

  @Roles(Role.ADMIN, Role.SUPERADMIN, )
  @ApiOperation({ summary: "Yangi bemor yaratish" })
  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTORS)
  @ApiOperation({ summary: "Barcha bemorlarni olish" })
  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTORS, "ID")
  @ApiOperation({ summary: "ID boyicha bitta bemorni olish" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.patientsService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, "ID")
  @ApiOperation({ summary: "Bemor ma'lumotlarini yangilash" })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: "Bemorni o'chirish" })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.patientsService.remove(+id);
  }
}
