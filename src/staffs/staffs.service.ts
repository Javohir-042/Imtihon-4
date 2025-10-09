import { ConflictException, Injectable, NotFoundException, Res } from "@nestjs/common";
import { CreateStaffDto } from "./dto/create-staff.dto";
import { UpdateStaffDto } from "./dto/update-staff.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Staff } from "./model/staff.model";
import { ResData } from "../lib/resData";

@Injectable()
export class StaffsService {
  constructor(
    @InjectModel(Staff) private readonly staffModel: typeof Staff
  ) { }

  async create(createStaffDto: CreateStaffDto): Promise<ResData<Staff | null>> {
    const { full_name, role, phone, email, is_active } = createStaffDto

    if (!full_name || !role || !phone || !email || !is_active) {
      throw new NotFoundException("Iltimos barchasini kiriting")
    }

    const existsEmail = await this.staffModel.findOne({ where: { email } })
    if (existsEmail) {
      throw new ConflictException("Email already exists")
    }
    
    const newStaffs = await this.staffModel.create({ ...createStaffDto })
    

    return new ResData<Staff>("Staffs create successFully", 201, newStaffs)
  }

  async findAll(): Promise<ResData<Staff[]>> {
    const staff = await this.staffModel.findAll({ include: { all: true }, order: [['id', 'ASC']] })

    return new ResData('Staffs successFully retrieved', 200, staff)
  }

  async findOne(id: number): Promise<ResData<Staff>> {
    const staff = await this.staffModel.findByPk(id)
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

  async remove(id: number) {
    const deleted = await this.staffModel.destroy({ where: { id } })
    if(!deleted){
      throw new NotFoundException('Budna Staffs mavjud emas')
    }
    return { message: `Staffs o'chirildi`}
  }
}
