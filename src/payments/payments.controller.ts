import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from "@nestjs/swagger";
import { AuthGuard } from "../common/guards/auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorator/roles.decorator";
import { Role } from "../common/enum/admin.enum";

@ApiTags("Payments - To'lovlar")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: "Yangi to'lov qo'shish" })
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: "Barcha to'lovlarni olish" })
  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: "Id bo'yicha to'lovni olish" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: "To'lovni yangilash" })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiOperation({ summary: "To'lovni o'chirish" })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.paymentsService.remove(+id);
  }
}
