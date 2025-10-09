import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AdminsService } from "../admins/admins.service";
import { JwtService } from "@nestjs/jwt";
import { Admin } from "../admins/model/admin.model";
import { Role } from "../common/enum/admin.enum";
import { CreateAdminDto } from "../admins/dto/create-admin.dto";
import { SigninAdminDto } from "../admins/dto/signin-admin.dto";
import bcrypt from "bcrypt";
import { Response } from "express";

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminsService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateToken(admin: Admin) {
    const payload = {
      id: admin.id,
      email: admin.email,
      isActive: admin.is_active,
      role: admin.role || Role.ADMIN,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),

      this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async signup(createAdminDto: CreateAdminDto) {
    const candidate = await this.adminService.findAdminByEmail(
      createAdminDto.email,
    );

    if (candidate) {
      throw new ConflictException("Bunday foydalanuvchi mavjud");
    }

    const newAdmin = await this.adminService.create(createAdminDto);
    return newAdmin;
  }

  async signin(signinAdminDto: SigninAdminDto, res: Response) {
    const admin = await this.adminService.findAdminByEmail(
      signinAdminDto.email,
    );
    if (!admin) {
      throw new UnauthorizedException(`Email yoki parol noto'g'ri`);
    }

    const verifyPassword = await bcrypt.compare(
      signinAdminDto.password,
      admin.password,
    );
    if (!verifyPassword) {
      throw new UnauthorizedException("Email yokii parol noto'g'ri");
    }

    const { accessToken, refreshToken } = await this.generateToken(admin);

    const hashedPasswordToken = await bcrypt.hash(refreshToken, 7);
    admin.refresh_token = hashedPasswordToken;
    await admin.save();
    res.cookie("refreshToken", refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return { accessToken, refreshToken };
  }

  async signOut(refreshToken: string, res: Response) {
    const adminData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });

    if (!adminData) {
      throw new BadRequestException("Admin not verified");
    }

    const admin = await this.adminService.findOne(adminData.id);
    if (!admin) {
      throw new BadRequestException("Noto'g'ri token yuborildi ");
    }

    admin.refresh_token = "";
    admin.save();

    res.clearCookie("refreshToken");
    return { message: "Admin logged out successfully" };
  }

  async refreshToken(adminId: number, refresh_token: string, res: Response) {
    const decodedToken = await this.jwtService.decode(refresh_token);

    if (adminId !== decodedToken["id"]) {
      throw new ForbiddenException(" Ruxsat etilmagan id");
    }

    const admin = await this.adminService.findOne(adminId);

    if (!admin || !admin.refresh_token) {
      throw new ForbiddenException("Ruxsat etilmagan admin");
    }

    const tokenMatch = await bcrypt.compare(refresh_token, admin.refresh_token);
    if (!tokenMatch) {
      throw new ForbiddenException("Forbidden");
    }

    const { accessToken, refreshToken } = await this.generateToken(admin);
    admin.refresh_token = await bcrypt.hash(refreshToken, 7);
    admin.save();

    res.cookie("refreshToken", refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });

    return {
      message: "admin refreshed",
      adminId: admin.id,
      access_token: accessToken,
    };
  }
}
