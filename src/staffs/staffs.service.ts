import { ConflictException, Injectable, NotFoundException, Res } from "@nestjs/common";
import { CreateStaffDto } from "./dto/create-staff.dto";
import { UpdateStaffDto } from "./dto/update-staff.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Staff } from "./model/staff.model";
import { ResData } from "../lib/resData";
import bcrypt from 'bcrypt'
import { StaffEnum } from "../common/enum/staffs.enum";

@Injectable()
export class StaffsService {
  constructor(
    @InjectModel(Staff) private readonly staffModel: typeof Staff
  ) { }


  async onModuleInit() {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;
    const name = String(process.env.SUPER_ADMIN_NAME) || "Javohir";

    if (!email || !password) return;

    const existSuperAdmin = await this.staffModel.findOne({ where: { email } });


    if (!existSuperAdmin) {
      const hashedPassword = await bcrypt.hash(password, 7);
      await this.staffModel.create({
        email,
        password: hashedPassword,
        full_name: name,
        role: StaffEnum.SUPERADMIN,
        is_active: true,
        phone: "+998976006787"
      });
      console.log(`Superadmin yaratildi: email - ${email} || password - ${password}`);
    }
  }

  async create(createStaffDto: CreateStaffDto): Promise<ResData<Staff | null>> {
    const { full_name, phone, email, is_active, password ,role} = createStaffDto

    if (!full_name || !phone || !email || !is_active || !password || !role) {
      throw new NotFoundException("Iltimos barchasini kiriting")
    }

    const existsEmail = await this.staffModel.findOne({ where: { email } })
    if (existsEmail) {
      throw new ConflictException("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 7)

    const newStaffs = await this.staffModel.create({
      full_name,
      phone,
      email,
      is_active,
      password: hashedPassword,
      role
    })


    return new ResData<Staff>("Staffs create successFully", 201, newStaffs)
  }

  async findAll(): Promise<ResData<Staff[]>> {
    const staff = await this.staffModel.findAll({ include: { all: true }, order: [['id', 'ASC']] })

    return new ResData('Staffs successFully retrieved', 200, staff)
  }

  async findOne(id: number): Promise<ResData<Staff>> {
    const staff = await this.staffModel.findByPk(id, { include: { all: true } })
    if (!staff) {
      throw new NotFoundException('Staff not found')
    }

    return new ResData('Staffs retrieved by id', 200, staff);
  }

  async update(id: number, updateStaffDto: UpdateStaffDto): Promise<ResData<Staff>> {
    const staff = await this.staffModel.findByPk(id)
    if (!staff) {
      throw new NotFoundException('Staff not found')
    }

    const { email } = updateStaffDto;

    if (email && email !== staff.email) {
      throw new ConflictException(`Emailni o'zgartirish mumkun emas`);
    }

    const newStaffs = await this.staffModel.update({ ...updateStaffDto }, { where: { id }, returning: true })

    return new ResData('Staffs update by id', 200, newStaffs[1][0])
  }

  async remove(id: number): Promise<ResData<null>> {
    if(id===1){
      throw new ConflictException("sz bu iddagi user ochira olmaysz")
    }
    const removed = await this.staffModel.destroy({ where: { id } });
    if (!removed) {
      throw new NotFoundException('Staffs not found');
    }
    return new ResData('Staffs deleted successfully', 200, null);
  }



  async findEmail(email: string) {
    return await this.staffModel.findOne({ where: { email } })
  }
}
