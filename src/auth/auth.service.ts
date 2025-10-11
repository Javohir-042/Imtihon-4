import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AdminsService } from "../admins/admins.service";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { Response } from "express";
import { StaffsService } from "../staffs/staffs.service";
import { PatientsService } from "../patients/patients.service";
import { SignInDto } from "../patients/dto/signIn.dto";
import { CreatePatientDto } from "../patients/dto/create-patient.dto";
import { Staff } from "../staffs/model/staff.model";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly patientsService: PatientsService,
    private readonly staffService: StaffsService,
    private readonly adminService: AdminsService,
  ) { }

  private async generateToken(staff: Staff) {
    const payload = {
      id: staff.id,
      email: staff.email,
      isActive: staff.is_active,
      role: staff.role || 'STAFF',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),

      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { accessToken, refreshToken };
  }


  async signUp(createPatientDto: CreatePatientDto) {
    const checkEmail = await this.patientsService.findEmail(createPatientDto.email);
    if (checkEmail) throw new BadRequestException("Bu email oldin ishlatilgan");

    const newPatient = await this.patientsService.create(createPatientDto);
    return newPatient;
  }


  async signInAdmin(signInDto: SignInDto, res?: Response<any, Record<string, any>>) {

    const { email, password } = signInDto;
    
    const admin = await this.adminService.findEmail(email);

    if (!admin) throw new NotFoundException("Email yoki parol noto'g'ri!");
    

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new BadRequestException("Email yoki parol noto'g'ri!");

    const payload = { id: admin.id, email: admin.email, role: "ADMIN" };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    });

    return { message: "Kirish muvaffaqiyatli", access_token: accessToken, refresh_token: refreshToken };

  }

  async signIn(signInDto: SignInDto, res?: Response<any, Record<string, any>>) {        // bu qo‘lda javob qaytarish imkonini beradi.  Masalan, cookie o‘rnatish, header qo‘shish yoki status kodini o‘zing belgilash uchun.

    const { email, password } = signInDto;
    const patient = await this.patientsService.findEmail(email);

    if (!patient) throw new BadRequestException("Email yoki parol noto'g'ri!");

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) throw new BadRequestException("Email yoki parol noto'g'ri!");

    const payload = { id: patient.id, email: patient.email, role: "PATIENT" };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    });

    return { message: "Kirish muvaffaqiyatli", access_token: accessToken, refresh_token: refreshToken };
  }



  async signInStaffs(signInDto: SignInDto): Promise<{ token: { accessToken: string; refreshToken: string } }> {
    const checkEmail = await this.staffService.findEmail(signInDto.email);
    if (!checkEmail) {
      throw new BadRequestException("Email or Password not found");
    }

    const isPasswordValid = await bcrypt.compare(signInDto.password, checkEmail.password);
    if (!isPasswordValid) {
      throw new BadRequestException("Email or Password not found");
    }

    const token = await this.generateToken(checkEmail); 

    return { token };
  }





}
