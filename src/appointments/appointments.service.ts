import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Appointment } from './model/appointment.model';
import { Doctor } from '../doctors/model/doctor.model';
import { Patient } from '../patients/model/patient.model';
import { ResData } from '../lib/resData';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment) private readonly appointmentsModel: typeof Appointment,
    @InjectModel(Doctor) private readonly doctorModel: typeof Doctor,
    @InjectModel(Patient) private readonly patientModel: typeof Patient,
  ) { }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<ResData<Appointment | null>> {
    const { doctor_id, patient_id, appointment_date, appointment_time, status, reason } = createAppointmentDto

    if (!doctor_id || !patient_id || !appointment_date || !appointment_time || !status || !reason) {
      throw new NotFoundException("Barchasini kiriting")
    }

    const doctor = await this.doctorModel.findOne({ where: { id: doctor_id } })
    if (!doctor) {
      throw new NotFoundException('Bunday doctor_id topilmadi')
    }

    const patient = await this.patientModel.findOne({ where: { id: patient_id } })
    if (!patient) {
      throw new NotFoundException('Bunday patient_id topilmadi')
    }

    const newAppointments = await this.appointmentsModel.create({ ...createAppointmentDto })

    return new ResData<Appointment>("Appointment create successFully", 201, newAppointments);
  }

  async findAll(): Promise<ResData<Appointment[]>> {
    const appointments = await this.appointmentsModel.findAll({ include: { all: true }, order: [['id', 'ASC']] })

    return new ResData('Appointments successFully retrieved', 200, appointments)
  }

  async findOne(id: number): Promise<ResData<Appointment>> {
    const appointment = await this.appointmentsModel.findByPk(id, { include: { all: true }})
    if(!appointment){
      throw new NotFoundException('Appointment not found')
    }

    return new ResData('Appointments retrieved by id', 200, appointment)
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<ResData<Appointment>> {
    const appointment = await this.appointmentsModel.findByPk(id)
    if(!appointment){
      throw new NotFoundException('Appointment not found')
    }

    const {doctor_id, patient_id} = updateAppointmentDto

    if(doctor_id){
      const doctor = await this.doctorModel.findByPk(doctor_id)
      if(!doctor){
        throw new NotFoundException("Bunday doctor_id topilmadi")
      }
    }

    if (patient_id) {
      const patient = await this.patientModel.findByPk(patient_id)
      if (!patient) {
        throw new NotFoundException("Bunday patient_id topilmadi")
      }
    }

    await appointment.update(updateAppointmentDto)

    return new ResData('Appointments successFully update', 200, appointment);
  }

  async remove(id: number) {
    const removed = await this.appointmentsModel.destroy({ where: { id } })
    if (!removed) {
      throw new NotFoundException("Bunday appointments mavjud emas")
    }
    return { message: `Appointments o'chirildi` }
  }
}
