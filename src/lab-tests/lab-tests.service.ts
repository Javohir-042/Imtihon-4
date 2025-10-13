import { Injectable, NotFoundException, Res } from '@nestjs/common';
import { CreateLabTestDto } from './dto/create-lab-test.dto';
import { UpdateLabTestDto } from './dto/update-lab-test.dto';
import { InjectModel } from '@nestjs/sequelize';
import { LabTest } from './model/lab-test.model';
import { Patient } from '../patients/model/patient.model';
import { Doctor } from '../doctors/model/doctor.model';
import { MedicalRecord } from '../medical-records/model/medical-record.model';
import { ResData } from '../lib/resData';

@Injectable()
export class LabTestsService {
  constructor(
    @InjectModel(LabTest) private readonly labTestModel: typeof LabTest,
    @InjectModel(Patient) private readonly patientModel: typeof Patient,
    @InjectModel(Doctor) private readonly doctorModel: typeof Doctor,
    @InjectModel(MedicalRecord) private readonly medicalRecordModel: typeof MedicalRecord,
  ) { }


  async create(createLabTestDto: CreateLabTestDto): Promise<ResData<LabTest | null>> {
    const { doctor_id, patient_id, medical_record_id, test_name, test_date, status, cost, result } = createLabTestDto

    if (doctor_id === undefined || patient_id === undefined || medical_record_id === undefined || !test_name || !test_date || !status || !cost || !result) {
      throw new NotFoundException('Barchasini kiriting')
    }

    const doctor = await this.doctorModel.findByPk(doctor_id)
    if (!doctor) {
      throw new NotFoundException('Bunday doctor_id topilmadi ')
    }


    const patient = await this.patientModel.findByPk(patient_id)
    if (!patient) {
      throw new NotFoundException('Bunday patient_id topilmadi ')
    }

    const medical_record = await this.medicalRecordModel.findByPk(medical_record_id)
    if (!medical_record) {
      throw new NotFoundException('Bunday MedicalRecord_id topilmadi ')
    }

    const newLatTests = await this.labTestModel.create({ ...createLabTestDto })

    return new ResData<LabTest>("LabTest create successFully", 201, newLatTests)
  }

  async findAll(): Promise<ResData<LabTest[]>> {
    const labTest = await this.labTestModel.findAll({ include: { all: true }, order: [['id', 'ASC']] })

    return new ResData("LabTests successFully retrieved", 200, labTest)
  }

  async findOne(id: number): Promise<ResData<LabTest>> {
    const labTest = await this.labTestModel.findByPk(id, { include: { all: true } })
    if (!labTest) {
      throw new NotFoundException('LabTest not found')
    }

    return new ResData("LabTests retrieved by id", 200,labTest)
  }

  async update(id: number, updateLabTestDto: UpdateLabTestDto): Promise<ResData<LabTest>> {
    const labTest = await this.labTestModel.findByPk(id)
    if (!labTest) {
      throw new NotFoundException('LabTest not found')
    }

    const { doctor_id, patient_id, medical_record_id } = updateLabTestDto

    if (doctor_id) {
      const doctor = await this.doctorModel.findByPk(doctor_id)
      if (!doctor) {
        throw new NotFoundException("Bunday doctor_id topilmadi")
      }
    }

    if (patient_id) {
      const patient = await this.patientModel.findByPk(patient_id)
      if (!patient) {
        throw new NotFoundException("Bunday patient_id topilmadi")
      }
    }

    if (medical_record_id) {
      const medical_record = await this.medicalRecordModel.findByPk(medical_record_id)
      if (!medical_record) {
        throw new NotFoundException("Bunday medical_record_id topilmadi")
      }
    }

    await this.labTestModel.update({ ...updateLabTestDto }, { where: { id }, returning: true })

    return new ResData('LabTests update by id', 200, labTest[1][0]);
  }

  async remove(id: number): Promise<ResData<null>> {
    const removed = await this.labTestModel.destroy({ where: { id } });
    if (!removed) {
      throw new NotFoundException("Bunday LabTest mavjud emas");
    }
    return new ResData("LabTest muvaffaqiyatli o'chirildi", 200, null);
  }

}
