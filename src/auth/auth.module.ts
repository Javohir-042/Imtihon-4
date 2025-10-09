import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { Admin } from "../admins/model/admin.model";
import { JwtModule } from "@nestjs/jwt";
import { AdminsModule } from "../admins/admins.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forFeature([Admin]),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_KEY || "defaultSecret",
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_TIME || "id" },
    }),
    AdminsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
