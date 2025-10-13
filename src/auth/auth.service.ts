import {
  BadRequestException,
  ForbiddenException,
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

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly patientsService: PatientsService,
    private readonly staffService: StaffsService,
    private readonly adminService: AdminsService,
  ) { }

  async signUp(createPatientDto: CreatePatientDto) {
    const checkEmail = await this.patientsService.findEmail(createPatientDto.email);
    if (checkEmail) throw new BadRequestException("Bu email oldin ishlatilgan");

    const newPatient = await this.patientsService.create(createPatientDto);
    return newPatient;
  }

  private async generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(user: any, refreshToken: string, res: Response) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
    user.refresh_token = hashedRefreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: Number(process.env.COOKIE_TIME) || 7 * 24 * 60 * 60 * 1000,
    });
  }


  // ======================== signIn ======================================


  async signInAdmin(signInDto: SignInDto, res: Response) {
    const { email, password } = signInDto;

    const admin = await this.adminService.findEmail(email);
    if (!admin) {
      throw new NotFoundException("Email yoki parol noto'g'ri!");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new BadRequestException("Email yoki parol noto'g'ri!");
    }

    const payload = { id: admin.id, email: admin.email, role: admin.role || "ADMIN" };

    const { accessToken, refreshToken } = await this.generateTokens(payload);

    await this.saveRefreshToken(admin, refreshToken, res);

    return {
      message: "Kirish muvaffaqiyatli",
      access_token: accessToken,
    };
  }


  async signInPatient(signInDto: SignInDto, res: Response) {
    try {
      const { email, password } = signInDto;

      const patient = await this.patientsService.findEmail(email);
      if (!patient) {
        throw new NotFoundException("Email yoki parol noto'g'ri!");
      }

      const isMatch = await bcrypt.compare(password, patient.password);
      if (!isMatch) {
        throw new BadRequestException("Email yoki parol noto'g'ri!");
      }

      const payload = { id: patient.id, email: patient.email, role: "PATIENT" };

      const { accessToken, refreshToken } = await this.generateTokens(payload);

      await this.saveRefreshToken(patient, refreshToken, res);

      return {
        message: "Kirish muvaffaqiyatli",
        access_token: accessToken,
      };

    } catch (error) {
      throw new BadRequestException("Kirishda xatolik: " + error.message);
    }
  }




  async signInStaffs(signInDto: SignInDto, res: Response) {
    try {
      const { email, password } = signInDto;

      const staff = await this.staffService.findEmail(email);                       // Email orqali staffni topish
      if (!staff) {
        throw new NotFoundException("Email yoki parol noto'g'ri!");
      }

      const isPasswordValid = await bcrypt.compare(password, staff.password);       // Parolni tekshirish
      if (!isPasswordValid) {
        throw new BadRequestException("Email yoki parol noto'g'ri!");
      }

      const payload = {                                                    // Tokenlar uchun payload
        id: staff.id,
        email: staff.email,
        role: staff.role || "STAFF",
      };

      const { accessToken, refreshToken } = await this.generateTokens(payload);

      await this.saveRefreshToken(staff, refreshToken, res);

      return {
        message: "Kirish muvaffaqiyatli",
        access_token: accessToken,
      };
    } catch (error) {
      throw new BadRequestException("Kirishda xatolik: ", error.message);
    }
  }


  // ====================== signOut ====================================


  async signAdminOut(refreshToken: string, res: Response) {
    try {
      const adminData = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      if (!adminData) {
        throw new BadRequestException("Admin not verified");
      }

      const admin = await this.adminService.findOne(adminData.id);
      if (!admin) {
        throw new BadRequestException("Noto'g'ri token yuborildi");
      }

      const tokenMatches = await bcrypt.compare(refreshToken, admin.refresh_token);
      if (!tokenMatches) {
        throw new BadRequestException("Token mos emas yoki allaqachon o'chirilgan");
      }

      admin.refresh_token = "";
      await admin.save();

      res.clearCookie("refreshToken");

      return { message: "Admin logged out successfully" };

    } catch (error) {
      throw new BadRequestException("Token noto'g'ri yoki muddati tugagan");
    }
  }


  async signPatientOut(refreshToken: string, res: Response) {
    try {
      const patientData = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      if (!patientData) {
        throw new BadRequestException("Patient not verified");
      }

      const patient = await this.patientsService.findOne(patientData.id);
      if (!patient) {
        throw new BadRequestException("Noto'g'ri token yuborildi");
      }

      const tokenMatches = await bcrypt.compare(refreshToken, patient.refresh_token);
      if (!tokenMatches) {
        throw new BadRequestException("Token mos emas yoki allaqachon o'chirilgan");
      }

      patient.refresh_token = "";
      await patient.save();

      res.clearCookie("refreshToken");

      return { message: "Patient logged out successfully" };

    } catch (error) {
      throw new BadRequestException("Token noto'g'ri yoki muddati tugagan");
    }
  }


  async signStaffOut(refreshToken: string, res: Response) {
    try {
      const staffData = await this.jwtService.verify(refreshToken, {          // Tokenni tekshirish
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      if (!staffData) {
        throw new BadRequestException("Staff not verified");
      }

      const staff = await this.staffService.findOne(staffData.id);        // Staffni bazadan topish
      if (!staff) {
        throw new BadRequestException("Noto'g'ri token yuborildi");
      }

      staff.refresh_token = "";                                           //  Refresh tokenni tozalash
      await staff.save();

      res.clearCookie("refreshToken");                                    // Cookie’ni tozalash

      return { message: "Staff logged out successfully" };

    } catch (error) {
      throw new BadRequestException("Token noto'g'ri yoki muddati tugagan");
    }
  }


  // ======================== Refresh =================================================


  async refreshAdminToken(adminId: number, refresh_token: string, res: Response) {
    const decoded = this.jwtService.decode(refresh_token);
    if (!decoded || adminId !== decoded["id"]) {
      throw new ForbiddenException("Ruxsat etilmagan ID");
    }

    const admin = await this.adminService.findOne(adminId);
    if (!admin || !admin.refresh_token) {
      throw new ForbiddenException("Ruxsat etilmagan foydalanuvchi");
    }

    const match = await bcrypt.compare(refresh_token, admin.refresh_token);
    if (!match) {
      throw new ForbiddenException("Token mos emas");
    }

    const payload = { id: admin.id, email: admin.email, role: "ADMIN" };
    const { accessToken, refreshToken } = await this.generateTokens(payload);

    await this.saveRefreshToken(admin, refreshToken, res);

    return {
      message: "Token yangilandi",
      userId: admin.id,
      access_token: accessToken,
    };
  }



  async refreshPatientToken(patientId: number, refresh_token: string, res: Response) {

    const decoded = this.jwtService.decode(refresh_token);
    if (!decoded || patientId !== decoded["id"]) {
      throw new ForbiddenException("Ruxsat etilmagan ID");
    }

    const patient = await this.patientsService.findOne(patientId);
    if (!patient || !patient.refresh_token) {
      throw new ForbiddenException("Ruxsat etilmagan foydalanuvchi");
    }

    const match = await bcrypt.compare(refresh_token, patient.refresh_token);
    if (!match) {
      throw new ForbiddenException("Token mos emas");
    }

    const payload = { id: patient.id, email: patient.email, role: "PATIENT" };
    const { accessToken, refreshToken } = await this.generateTokens(payload);

    await this.saveRefreshToken(patient, refreshToken, res);

    return {
      message: "Token yangilandi",
      userId: patient.id,
      access_token: accessToken,
    };
  }


  async refreshStaffToken(staffId: number, refresh_token: string, res: Response) {

    const decoded = this.jwtService.decode(refresh_token);
    if (!decoded || staffId !== decoded["id"]) {
      throw new ForbiddenException("Ruxsat etilmagan ID");
    }

    const staff = await this.staffService.findOne(staffId);
    if (!staff || !staff.refresh_token) {
      throw new ForbiddenException("Ruxsat etilmagan foydalanuvchi");
    }

    const match = await bcrypt.compare(refresh_token, staff.refresh_token);
    if (!match) {
      throw new ForbiddenException("Token mos emas");
    }

    const payload = { id: staff.id, email: staff.email, role: "STAFF" };
    const { accessToken, refreshToken } = await this.generateTokens(payload);

    await this.saveRefreshToken(staff, refreshToken, res);

    return {
      message: "Token yangilandi",
      userId: staff.id,
      access_token: accessToken,
    };
  }

}
