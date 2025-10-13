import {
  BadRequestException,
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
import { Role } from "../common/enum/admin.enum";
import { Op } from "sequelize";
import otpGenerator from 'otp-generator'
import { BotService } from "../bot/bot.service";
import { PhoneAdminDto } from "./dto/phone.admin.dto";


@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin) private readonly adminModel: typeof Admin,
  private readonly botService: BotService
) { }


  async create(createAdminDto: CreateAdminDto): Promise<ResData<Admin | null>> {
    const { full_name, email, username, password, is_active } =
      createAdminDto;

    if (!full_name || !email || !username || !password ) {
      throw new NotFoundException("Barchasini kiriting");
    }

    const existsEmail = await this.adminModel.findOne({ where: { email } });
    if (existsEmail) {
      throw new ConflictException("Email already exists");
    }

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
      role: Role.ADMIN,
      is_active,
    });

   

    return new ResData<Admin>("Admin create successFully", 201, newAdmin);
  }

  async findEmail(email: string) {
    const data = await this.adminModel.findOne({ where: { email: email} })
    return data
  }


  async findAll(): Promise<ResData<Admin[]>> {
    const admin = await this.adminModel.findAll({
      include: { all: true },
      order: [["id", "ASC"]],
      where: {id: {[Op.ne]: 1}}
    });
    return new ResData("Admin successFully retrieved", 200, admin);
  }

  async findOne(id: number){
    const admin = await this.adminModel.findOne({where:{id}});
    if (!admin) {
      throw new NotFoundException("Admin not found"); 
    }

    return admin;
  }

  async update(
    id: number,
    updateAdminDto: UpdateAdminDto,
  ): Promise<ResData<Admin>> {
    if (id === 1) {
      throw new ConflictException("Siz bu id dagi userni update qilish xuquqiga ega emassiz")
    }
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
    if(id === 1){
      throw new ConflictException("Siz bu id dagi userni o'chirish xuquqiga ega emassiz")
    }

    const removed = await this.adminModel.destroy({ where: { id } });
    if (!removed) {
      throw new NotFoundException("Bunday admin mavjud emas");
    }
    return { message: `admin o'chirildi` };
  }


  async newOtp(phoneAdminDto: PhoneAdminDto){
    const phone_number = phoneAdminDto.phone_number;

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const isSend = await this.botService.sendOtp(phone_number, otp);
    if(!isSend){
      throw new BadRequestException("Avval botdan royxatdan o'ting")
    }

    return {
      message: 'Botga otp yuborildi',
    };
  }



  async onModuleInit() {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;
    const name = String(process.env.SUPER_ADMIN_NAME) || "Javohir";

    if (!email || !password) return;

    const existSuperAdmin = await this.adminModel.findOne({ where: { email } });


    if (!existSuperAdmin) {
      const hashedPassword = await bcrypt.hash(password, 7);
      await this.adminModel.create({
        email,
        password: hashedPassword,
        full_name: name,
        role: Role.SUPERADMIN,
        is_active: true,
        username: "superadmin"
      });
      console.log(`Superadmin yaratildi: email - ${email} || password - ${password}`);
    }
  }
}
