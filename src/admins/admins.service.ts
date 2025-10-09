import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Admin } from "./model/admin.model";
import bcrypt from "bcrypt";
import { ResData } from "../lib/resData";

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin) private readonly adminModel: typeof Admin) {}

  async create(createAdminDto: CreateAdminDto): Promise<ResData<Admin | null>> {
    const { full_name, email, username, password, role, is_active } =
      createAdminDto;

    if (!full_name || !email || !username || !password || !role) {
      throw new NotFoundException("Barchasini kiriting");
    }

    // Email mavjudligini tekshirish
    const existsEmail = await this.adminModel.findOne({ where: { email } });
    if (existsEmail) {
      throw new ConflictException("Email already exists");
    }

    // Username mavjudligini tekshirish
    const existsUsername = await this.adminModel.findOne({
      where: { username },
    });
    if (existsUsername) {
      throw new NotFoundException("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 7);

    const newAdmin = await this.adminModel.create({
      full_name,
      email,
      username,
      password: hashedPassword,
      role,
      is_active,
    });

    return new ResData<Admin>("Admin create successFully", 201, newAdmin);
  }

  async findAdminByEmail(email: string) {
    const admin = await this.adminModel.findOne({
      where: { email },
    });
    return admin;
  }

  async findAll(): Promise<ResData<Admin[]>> {
    const admin = await this.adminModel.findAll({
      include: { all: true },
      order: [["id", "ASC"]],
    });
    return new ResData("Admin successFully retrieved", 200, admin);
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminModel.findByPk(id, { include: { all: true } });
    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    return admin;
  }

  async update(
    id: number,
    updateAdminDto: UpdateAdminDto,
  ): Promise<ResData<Admin>> {
    const admin = await this.adminModel.findByPk(id);
    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    const { email, username } = updateAdminDto;

    if (email && email !== admin.email) {
      throw new ConflictException(`Emailni o'zgartirish mumkun emas`);
    }

    if (username && username !== admin.username) {
      throw new ConflictException(`Username o'zgaritshi mumkun emas`);
    }

    await admin.update(updateAdminDto);

    return new ResData("Admin successFully update", 200, admin);
  }

  async remove(id: number) {
    const removed = await this.adminModel.destroy({ where: { id } });
    if (!removed) {
      throw new NotFoundException("Bunday admin mavjud emas");
    }
    return { message: `admin o'chirildi` };
  }
}
