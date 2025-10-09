import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Doctor } from './model/doctor.model';
import { ResData } from '../lib/resData';
import bcrypt from 'bcrypt'

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor) private readonly doctorsModel: typeof Doctor
  ) { }

  async create(createDoctorDto: CreateDoctorDto): Promise<ResData<Doctor | null>> {
    const { full_name, specialization, password, phone, email, is_active } = createDoctorDto;

    if (!full_name || !specialization || !password || !phone || !email || !is_active) {
      throw new NotFoundException("Barchasini kiriting")
    }

    const existsEmail = await this.doctorsModel.findOne({ where: { email } })
    if (existsEmail) {
      throw new ConflictException("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 7);

    const newDoctor = await this.doctorsModel.create({
      full_name,
      specialization,
      password: hashedPassword,
      phone,
      email,
      is_active,
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

    if (updateDoctorDto.email && updateDoctorDto.email !== doctor.email) {
      throw new ConflictException("Emailni o'zgartirish mumkun emas");
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
