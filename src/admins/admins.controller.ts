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
import { AdminsService } from "./admins.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Admin } from "./model/admin.model";
import { AuthGuard } from "../common/guards/auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";

@ApiTags("Admin - Boshqaruvchi")
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller("admins")
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @ApiOperation({ summary: "Admin yaratish" })
  @ApiResponse({
    status: 201,
    description: "Yangi qoshilgan admin",
    type: Admin,
  })
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @ApiOperation({ summary: `Admin larni ko'rish` })
  @ApiResponse({
    status: 200,
    description: `Adminlarni ko'rish`,
    type: [Admin],
  })
  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @ApiOperation({ summary: `Admin ni korish by id orqali` })
  @ApiResponse({
    status: 200,
    description: `Adminlarni by id `,
    type: Admin,
  })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.adminsService.findOne(+id);
  }

  @ApiOperation({ summary: `Admin by id orqali o'zgartirish` })
  @ApiResponse({
    status: 200,
    description: `Admin by id orqali o'zgartirish`,
    type: Admin,
  })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(+id, updateAdminDto);
  }

  @ApiOperation({ summary: `Adminni o'chirish` })
  @ApiResponse({
    status: 200,
    description: `Admin o'chirildi`,
    type: Admin,
  })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.adminsService.remove(+id);
  }
}
