import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtModule } from "@nestjs/jwt";
import { Patient } from "../patients/model/patient.model";
import { PatientsModule } from "../patients/patients.module";
import { AdminsModule } from "../admins/admins.module";
import { StaffsModule } from "../staffs/staffs.module";
import { Staff } from "../staffs/model/staff.model";
import { Admin } from "../admins/model/admin.model";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forFeature([Patient, Admin, Staff]),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_KEY || "defaultSecret",
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_TIME || "id" },
    }),
    forwardRef(() => PatientsModule),
    forwardRef(() => StaffsModule),
    forwardRef(() => AdminsModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
