import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { InjectModel } from '@nestjs/sequelize';
import { MedicalRecord } from './model/medical-record.model';
import { Doctor } from '../doctors/model/doctor.model';
import { Appointment } from '../appointments/model/appointment.model';
import { Patient } from '../patients/model/patient.model';
import { ResData } from '../lib/resData';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectModel(MedicalRecord) private readonly medicalRecordModel: typeof MedicalRecord,
    @InjectModel(Doctor) private readonly doctorModel: typeof Doctor,
    @InjectModel(Appointment) private readonly appointmentModel: typeof Appointment,
    @InjectModel(Patient) private readonly patientModel: typeof Patient,
  ) { }

  async create(createMedicalRecordDto: CreateMedicalRecordDto): Promise<ResData<MedicalRecord | null>> {

    const { doctor_id, appointment_id, patient_id, diagnosis, symptoms, treatment, record_date } = createMedicalRecordDto

    if (doctor_id === undefined || appointment_id === undefined || patient_id === undefined || !diagnosis || !symptoms || !treatment || !record_date) {
      throw new NotFoundException("Barchasini kiriting ")
    }

    const doctor = await this.doctorModel.findByPk(doctor_id)
    if (!doctor) {
      throw new NotFoundException("Bunday doctor_id topilmadi")
    }

    const appointment = await this.appointmentModel.findByPk(appointment_id)
    if (!appointment) {
      throw new NotFoundException("Bunday appointment_id topilmadi")
    }

    const patient = await this.patientModel.findByPk(patient_id)
    if (!patient) {
      throw new NotFoundException("Bunday patient_id topilmadi")
    }

    const newMedicalRecords = await this.medicalRecordModel.create({
      ...createMedicalRecordDto,
      record_date: new Date(createMedicalRecordDto.record_date)
    });



    return new ResData<MedicalRecord>('MedicalRecords create successFully', 201, newMedicalRecords)
  }

  async findAll(): Promise<ResData<MedicalRecord[]>> {
    const medicalRecord = await this.medicalRecordModel.findAll({ include: { all: true }, order: [['id', 'ASC']] })

    return new ResData("medicalRecords successFully retrieved", 200, medicalRecord)
  }

  async findOne(id: number): Promise<ResData<MedicalRecord>> {
    const medicalRecord = await this.medicalRecordModel.findByPk(id, { include: { all: true } })
    if (!medicalRecord) {
      throw new NotFoundException('MedicalRecord not found')
    }

    return new ResData('MedicalRecords retrieved by id', 200, medicalRecord);
  }

  async update(id: number, updateMedicalRecordDto: UpdateMedicalRecordDto): Promise<ResData<MedicalRecord>> {
    const medicalRecords = await this.medicalRecordModel.findByPk(id)
    if (!medicalRecords) {
      throw new NotFoundException('MedicalRecords not found')
    }

    
    const { doctor_id, appointment_id, patient_id } = updateMedicalRecordDto

    if (doctor_id) {
      const doctor = await this.doctorModel.findByPk(doctor_id)
      if (!doctor) {
        throw new NotFoundException("Bunday doctor_id topilmadi")
      }
    }

    if (appointment_id) {
      const appointment = await this.appointmentModel.findByPk(appointment_id)
      if (!appointment) {
        throw new NotFoundException("Bunday appointment_id topilmadi")
      }
    }

    if (patient_id) {
      const patient = await this.patientModel.findByPk(patient_id)
      if (!patient) {
        throw new NotFoundException("Bunday patient_id topilmadi")
      }
    }

    const newMedicalRecords = await this.medicalRecordModel.update({
      doctor_id,
      appointment_id
     }, { where: { id }, returning: true })


    return new ResData('MedicalRecords successFully update', 200, newMedicalRecords[1][0])
  }

  async remove(id: number): Promise<ResData<null>> {
    const removed = await this.medicalRecordModel.destroy({ where: { id } });
    if (!removed) {
      throw new NotFoundException("Bunday medicalRecords mavjud emas");
    }
    return new ResData("medicalRecords muvaffaqiyatli o'chirildi", 200, null);
  }
}
