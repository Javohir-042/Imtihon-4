import { forwardRef, Module } from "@nestjs/common";
import { AdminsService } from "./admins.service";
import { AdminsController } from "./admins.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Admin } from "./model/admin.model";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [SequelizeModule.forFeature([Admin]),
  forwardRef(() => AuthModule),
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule { }
