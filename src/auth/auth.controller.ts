import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "../common/decorator/roles.decorator";
import { Admin } from "../admins/model/admin.model";
import type { Response } from "express";
import { CookieGetter } from "../common/decorator/cookie-getter.decorator";
import { CreatePatientDto } from "../patients/dto/create-patient.dto";
import { SignInDto } from "../patients/dto/signIn.dto";

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
  @Post('patient/signin')
  async signInPatient(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(signInDto);
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
    return this.authService.signInAdmin(signInDto);
  }


  @ApiOperation({ summary: "Auth token chiqarish (staff)" })
  @Post('staff/signin')
  async signInStaff(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { token } = await this.authService.signInStaffs(signInDto);

    res.cookie('access_token', token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.cookie('refresh_token', token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { token };
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
    res.clearCookie('refresh_token')
    return { message: "Signed out successfully" }
  }




  // @ApiOperation({ summary: "Auth refresh token chiqarish" })
  // @ApiResponse({
  //   status: 200,
  //   description: "Foydalanuvchining tokeni",
  //   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  // })
  // @HttpCode(200)
  // @Post(":id/refresh")
  // refresh(
  //   @Param("id", ParseIntPipe) id: number,
  //   @CookieGetter("refreshToken") refreshToken: string,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   return this.authService.refreshToken(id, refreshToken, res);
  // }
}
