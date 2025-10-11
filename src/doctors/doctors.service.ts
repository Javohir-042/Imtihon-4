import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Doctor } from './model/doctor.model';
import { ResData } from '../lib/resData';
import bcrypt from 'bcrypt'
import { Staff } from '../staffs/model/staff.model';
import { Role } from '../roles/model/role.model';
import { Roles } from '../common/decorator/roles.decorator';
import { StaffEnum } from '../common/enum/staffs.enum';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor) private readonly doctorsModel: typeof Doctor,
    @InjectModel(Staff) private readonly staffModel: typeof Staff,
  ) { }

  async create(createDoctorDto: CreateDoctorDto): Promise<ResData<Doctor | null>> {
    const { specialization, staffs_id} = createDoctorDto;

    if ( !specialization ||staffs_id === undefined) {
      throw new NotFoundException("Barchasini kiriting")
    }

    const staff = await this.staffModel.findByPk(staffs_id)
    if (!staff || staff.role!==StaffEnum.DOCTORS) {
      throw new NotFoundException('Bunday Staff_id topilmadi')
    }


    const newDoctor = await this.doctorsModel.create({
      specialization,
      staffs_id,
    })

    return new ResData<Doctor>("Doctor create successFully ", 201, newDoctor)
  }

  async findAll(): Promise<ResData<Doctor[]>> {
    const doctor = await this.doctorsModel.findAll({ include: { all: true }, order: [['id', 'ASC']] })

    return new ResData("Doctor successFully retrieved", 200, doctor);
  }

  async findOne(id: number): Promise<ResData<Doctor>> {
    const doctor = await this.doctorsModel.findByPk(id, { include: { all: true } })
    if (!doctor) {
      throw new NotFoundException("Doctro not found")
    }

    return new ResData('Doctor retrieved by id', 200, doctor);
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<ResData<Doctor>> {
    const doctor = await this.doctorsModel.findByPk(id)
    if (!doctor) {
      throw new NotFoundException("Doctor not found")
    }

    if (updateDoctorDto.staffs_id) {
      const staff = await this.staffModel.findByPk(updateDoctorDto.staffs_id)
      if (!staff) {
        throw new NotFoundException("Bunday staff_id topilmadi")
      }
    }

    const newDoctor = await this.doctorsModel.update({ ...updateDoctorDto }, { where: { id }, returning: true })

    return new ResData("Doctor update by id", 200, newDoctor[1][0])
  }

  async remove(id: number) {
    const deleted = await this.doctorsModel.destroy({ where: { id } })
    if (!deleted) {
      throw new NotFoundException("Bunday Doctor mavjud emas")
    }
    return { message: `Doctors O'chirild` }
  }
}
