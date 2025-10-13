import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "../common/decorator/roles.decorator";
import { Admin } from "../admins/model/admin.model";
import type { Response } from "express";
import { CookieGetter } from "../common/decorator/cookie-getter.decorator";
import { CreatePatientDto } from "../patients/dto/create-patient.dto";
import { SignInDto } from "../patients/dto/signIn.dto";
import { Role } from "../common/enum/admin.enum";

@ApiTags("Auth -- Token olish")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: "Auth yaratish" })
  @ApiResponse({
    status: 201,
    description: "Yangi qoshilgan foydalanuvchi",
    type: Admin,
  })
  @Roles(Role.ADMIN, Role.DOCTORS, Role.SUPERADMIN)
  @ApiBearerAuth()
  @Roles("public")
  @Post('patient/signup')
  async signUpPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.authService.signUp(createPatientDto);
  }


  @ApiOperation({ summary: "Auth token chiqarish" })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchining tokeni",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @Roles("public")
  @Post('admin/signin')
  async signInAdmin(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signInAdmin(signInDto,res);
  }



  @ApiOperation({ summary: "Auth token chiqarish" })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchining tokeni",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @Roles("public")
  @Post('patient/signin')
  async signInPatient(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signInPatient(signInDto, res);
  }


  @ApiOperation({ summary: "Auth token chiqarish (staff)" })
  @Post('staff/signin')
  async signInStaff(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signInStaffs(signInDto, res)
  }



  @ApiOperation({ summary: "Auth token O'chirish" })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchining tokeni o'chirildi",
    example: { message: "Signed out successfully" },
  })
  @HttpCode(200)
  @Post("admin/signOut")
  async signAdminOut(
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signAdminOut(refreshToken, res);
  }


  @ApiOperation({ summary: "Auth token O'chirish" })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchining tokeni o'chirildi",
    example: { message: "Signed out successfully" },
  })
  @HttpCode(200)
  @Post("patient/signOut")
  async signPatientOut(
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signPatientOut(refreshToken, res);
  }


  @ApiOperation({ summary: "Auth token O'chirish" })
  @ApiResponse({
    status: 200,
    description: "Foydalanuvchining tokeni o'chirildi",
    example: { message: "Signed out successfully" },
  })
  @HttpCode(200)
  @Post("staff/signOut")
  async signStaffOut(
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signStaffOut(refreshToken, res);
  }


  @ApiOperation({ summary: "Admin refresh token olish" })
  @ApiResponse({ status: 200, description: "Yangi access token qaytariladi" })
  @HttpCode(200)
  @Post(":id/adminRefresh")
  refresh(
    @Param("id", ParseIntPipe) id: number,
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshAdminToken(id, refreshToken, res);
  }


  @ApiOperation({ summary: "Patient refresh token olish" })
  @ApiResponse({ status: 200, description: "Yangi access token qaytariladi" })
  @HttpCode(200)
  @Post(":id/patientRefresh")
  refreshPatient(
    @Param("id", ParseIntPipe) id: number,
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshPatientToken(id, refreshToken, res);
  }


  @ApiOperation({ summary: "Staff refresh token olish" })
  @ApiResponse({ status: 200, description: "Yangi access token qaytariladi" })
  @HttpCode(200)
  @Post(":id/staffRefresh")
  refreshStaff(
    @Param("id", ParseIntPipe) id: number,
    @CookieGetter("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshStaffToken(id, refreshToken, res);
  }


}
