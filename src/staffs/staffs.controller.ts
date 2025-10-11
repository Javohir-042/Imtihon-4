import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { StaffsService } from "./staffs.service";
import { CreateStaffDto } from "./dto/create-staff.dto";
import { UpdateStaffDto } from "./dto/update-staff.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../common/guards/auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorator/roles.decorator";
import { Role } from "../common/enum/admin.enum";

@ApiTags('Staffs - Xodimlar')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller("staffs")
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffsService.create(createStaffDto);
  }

  @Roles(Role.ADMIN,Role.SUPERADMIN)
  @Get()
  findAll() {
    return this.staffsService.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, "ID")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.staffsService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN, "ID")
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffsService.update(+id, updateStaffDto);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.staffsService.remove(+id);
  }
}
