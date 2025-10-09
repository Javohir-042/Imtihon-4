import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "../common/decorator/roles.decorator";
import { Admin } from "../admins/model/admin.model";
import { CreateAdminDto } from "../admins/dto/create-admin.dto";
import { SigninAdminDto } from "../admins/dto/signin-admin.dto";
import type { Response } from "express";
import { CookieGetter } from "../common/decorator/cookie-getter.decorator";

@ApiTags("Auth -- Token olish")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Auth yaratish" })
  @ApiResponse({
    status: 201,
    description: "Yangi qoshilgan foydalanuvchi",
    type: Admin,
  })
  @Roles("public")
  @Post("signup")
  async signup(@Body() createdAdminDto: CreateAdminDto) {
    return this.authService.signup(createdAdminDto);
  }

  @ApiOperation({ summary: "Auth token chiqarish" })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchining tokeni",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @Roles("public")
  @Post("signin")
  @HttpCode(HttpStatus.OK)
  signin(
    @Body() signinAdminDto: SigninAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signin(signinAdminDto, res);
  }

  @ApiOperation({ summary: "Auth token O'chirish" })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchining tokeni",
    example: "Token o'chirildi",
  })
  @HttpCode(200)
  @Post("signOut")
  signOut(
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(refreshToken, res);
  }

  @ApiOperation({ summary: "Auth refresh token chiqarish" })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchining tokeni",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @HttpCode(200)
  @Post(":id/refresh")
  refresh(
    @Param("id", ParseIntPipe) id: number,
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(id, refreshToken, res);
  }
}
