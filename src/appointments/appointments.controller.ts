import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { Roles } from "../common/decorator/roles.decorator";
import { Role } from "../common/enum/admin.enum";

@ApiTags("Appointments")
@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @ApiOperation({ summary: "Yangi appointment yaratish" })
  @Roles(Role.SUPERADMIN, Role.DOCTORS,Role.ADMIN )
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @ApiOperation({ summary: "Barcha appointmentlarni olish" })
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @ApiOperation({ summary: "Id bo'yicha appointmentni olish" })
  @Roles(Role.SUPERADMIN, Role.ADMIN, 'ID')
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @ApiOperation({ summary: "Appointmentni yangilash" })
  @Roles(Role.SUPERADMIN, Role.ADMIN, "ID")
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @ApiOperation({ summary: "Appointmentni o'chirish" })
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.appointmentsService.remove(+id);
  }
}
