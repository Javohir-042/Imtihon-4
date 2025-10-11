import { forwardRef, Module } from "@nestjs/common";
import { StaffsService } from "./staffs.service";
import { StaffsController } from "./staffs.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Staff } from "./model/staff.model";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [SequelizeModule.forFeature([Staff]),
  forwardRef(() => AuthModule),
  ],
  controllers: [StaffsController],
  providers: [StaffsService],
  exports: [StaffsService],
})
export class StaffsModule { }
