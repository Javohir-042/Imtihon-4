import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Prescription } from './model/prescription.model';
import { MedicalRecord } from '../medical-records/model/medical-record.model';
import { Medication } from '../medications/model/medication.model';
import { ResData } from '../lib/resData';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectModel(Prescription) private readonly prescriptionModel: typeof Prescription,
    @InjectModel(MedicalRecord) private readonly medicalRecordModel: typeof MedicalRecord,
    @InjectModel(Medication) private readonly medicationModel: typeof Medication,
  ) { }

  async create(createPrescriptionDto: CreatePrescriptionDto): Promise<ResData<Prescription | null>> {
    const { medical_record_id, medication_id, dosage, frequency, duration_days, prescribed_date } = createPrescriptionDto

    if (medical_record_id === undefined || medication_id === undefined || !dosage || !frequency || !duration_days || !prescribed_date) {
      throw new BadRequestException("Barchasini kiriting")
    }

    const medical_record = await this.medicalRecordModel.findByPk(medical_record_id)
    if (!medical_record) {
      throw new NotFoundException('Bunday Medical_record_id topilmadi')
    }

    const medication = await this.medicationModel.findByPk(medication_id)
    if (!medication) {
      throw new NotFoundException('Bunday Medication_id topilmadi')
    }

    const newPrescriptions = await this.prescriptionModel.create(createPrescriptionDto);


    return new ResData<Prescription>("Prescriptions create successFully", 201, newPrescriptions)
  }

  async findAll(): Promise<ResData<Prescription[]>> {
    const prescriptions = await this.prescriptionModel.findAll({ include: { all: true }, order: [['id', 'ASC']] })

    return new ResData("Prescriptions successFully retrieved", 200, prescriptions);
  }

  async findOne(id: number): Promise<ResData<Prescription>> {
    const prescriptions = await this.prescriptionModel.findByPk(id, { include: { all: true } })
    if (!prescriptions) {
      throw new NotFoundException('Prescriptions not found')
    }

    return new ResData('Prescriptions retrieved by id', 200, prescriptions);
  }

  async update(id: number, updatePrescriptionDto: UpdatePrescriptionDto): Promise<ResData<Prescription>> {
    const prescriptions = await this.prescriptionModel.findByPk(id)
    if (!prescriptions) {
      throw new NotFoundException('Prescriptions not found')
    }

    const { medical_record_id, medication_id } = updatePrescriptionDto

    if (medical_record_id) {
      const medical_record = await this.medicalRecordModel.findByPk(medical_record_id)
      if (!medical_record) {
        throw new NotFoundException("Bunday medical_record_id topilmadi")
      }
    }

    if (medication_id) {
      const medication = await this.medicationModel.findByPk(medication_id)
      if (!medication) {
        throw new NotFoundException("Bunday medication_id topilmadi")
      }
    }

    await prescriptions.update(updatePrescriptionDto)

    return new ResData('Prescriptions successFully update', 200, prescriptions[1][0]);
  }

  async remove(id: number): Promise<ResData<null>> {
    const removed = await this.prescriptionModel.destroy({ where: { id } });
    if (!removed) {
      throw new NotFoundException("Bunday prescriptions mavjud emas");
    }
    return new ResData("Prescription muvaffaqiyatli o'chirildi", 200, null);
  }

}
