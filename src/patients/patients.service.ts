import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Patient } from './model/patient.model';
import bcrypt from 'bcrypt'
import { ResData } from '../lib/resData';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient) private readonly patientModel: typeof Patient,
  ) { }

  async create(createPatientDto: CreatePatientDto) {
    const { full_name, email, date_of_birth, gender, phone, address, blood_group, password } = createPatientDto

    if (!full_name || !email || !date_of_birth || !gender || !phone || !address || !blood_group || !password) {
      throw new NotFoundException('Barchasini kiriting')
    }

    const existsEmail = await this.patientModel.findOne({ where: { email } })
    if (existsEmail) {
      throw new BadRequestException('Email alrady exists')
    }

    const existsPhone = await this.patientModel.findOne({ where: { phone } })
    if (existsPhone) {
      throw new BadRequestException('Phone alrady exists')
    }

    const hashedPassword = await bcrypt.hash(password, 7);

    const newPatient = await this.patientModel.create({
      full_name,
      date_of_birth: new Date(date_of_birth),
      gender,
      phone,
      address,
      blood_group,
      email,
      password: hashedPassword
    })

    return newPatient;
  }

  async findAll(){
    const patients = await this.patientModel.findAll({ include: { all: true }, order: [['id', 'ASC']] })

    return patients;
  }

  async findOne(id: number){
    const patients =  await this.patientModel.findOne({ where: { id } });

    if (!patients) {
      throw new NotFoundException('Patients not found')
    }
    return patients;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<ResData<Patient>> {
    const patients = await this.patientModel.findByPk(id)
    if (!patients) {
      throw new NotFoundException('Patients not found')
    }

    if (updatePatientDto.email && updatePatientDto.email !== patients.email) {
      throw new NotFoundException(`Emailni o'zgartirish mumkun emas`)
    }

    if (updatePatientDto.phone && updatePatientDto.phone !== patients.phone) {
      const existsPhone = await this.patientModel.findOne({
        where: { phone: updatePatientDto.phone },
      });
      if (existsPhone) {
        throw new NotFoundException('Bu telefon raqami allaqachon ishlatilgan');
      }
    }

    if (updatePatientDto.date_of_birth) {
      updatePatientDto.date_of_birth = new Date(updatePatientDto.date_of_birth) as any;
    }

    const newPatients = await this.patientModel.update({ ...updatePatientDto }, { where: { id }, returning: true });

    return new ResData('Patients successFully update', 200, newPatients[1][0]);
  }

  async remove(id: number): Promise<ResData<null>> {
    const removed = await this.patientModel.destroy({ where: { id } });
    if (!removed) {
      throw new NotFoundException("Bunday patients mavjud emas");
    }
    return new ResData("Patients muvaffaqiyatli o'chirildi", 200, null);
  }



  async findEmail(email: string) {
    return await this.patientModel.findOne({ where: { email } })
  }


}
