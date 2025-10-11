import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CreateLabTestDto } from "./dto/create-lab-test.dto";
import { LabTestsService } from "./lab-tests.service";
import { UpdateLabTestDto } from "./dto/update-lab-test.dto";
import { AuthGuard } from "../common/guards/auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorator/roles.decorator";
import { Role } from "../common/enum/admin.enum";

@ApiTags("Lab Tests - Laboratoriya tekshiruvlari")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller("lab_tests")
export class LabTestsController {
  constructor(private readonly labTestsService: LabTestsService) { }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTORS)
  @ApiOperation({ summary: "Yangi lab test yaratish" })
  @Post()
  create(@Body() createLabTestDto: CreateLabTestDto) {
    return this.labTestsService.create(createLabTestDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTORS)
  @ApiOperation({ summary: "Barcha lab testlarni olish" })
  @Get()
  findAll() {
    return this.labTestsService.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTORS, "ID")
  @ApiOperation({ summary: "Id bo'yicha lab testni olish" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.labTestsService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.DOCTORS)
  @ApiOperation({ summary: "Lab testni yangilash" })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateLabTestDto: UpdateLabTestDto) {
    return this.labTestsService.update(+id, updateLabTestDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: "Lab testni o'chirish" })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.labTestsService.remove(+id);
  }
}
