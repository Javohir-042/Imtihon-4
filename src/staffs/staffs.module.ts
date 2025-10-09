import { Module } from "@nestjs/common";
import { StaffsService } from "./staffs.service";
import { StaffsController } from "./staffs.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Staff } from "./model/staff.model";

@Module({
  imports:[SequelizeModule.forFeature([Staff])],
  controllers: [StaffsController],
  providers: [StaffsService],
})
export class StaffsModule {}
