import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Medication } from './model/medication.model';
import { ResData } from '../lib/resData';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectModel(Medication) private readonly medicationModel: typeof Medication
  ) { }

  async create(createMedicationDto: CreateMedicationDto): Promise<ResData<Medication | null>> {
    const { name, category, unit_price, unit, stock_quantity, is_available } = createMedicationDto

    if (!name || !category || !unit_price || !unit || !stock_quantity || !is_available) {
      throw new NotFoundException('Barchasini kiriting')
    }

    const newMedication = await this.medicationModel.create({ ...createMedicationDto })

    return new ResData<Medication>("Medications create successFully", 201, newMedication)
  }

  async findAll(): Promise<ResData<Medication[]>> {
    const medication = await this.medicationModel.findAll({ include: { all: true }, order: [['id', 'ASC']] })

    return new ResData('Medication successFully retrieved', 200, medication)
  }

  async findOne(id: number): Promise<ResData<Medication>> {
    const medication = await this.medicationModel.findByPk(id)
    if (!medication) {
      throw new NotFoundException("Medication not found")
    }

    return new ResData('Medication retrieved by id', 200, medication);
  }

  async update(id: number, updateMedicationDto: UpdateMedicationDto): Promise<ResData<Medication>> {
    const medication = await this.medicationModel.findByPk(id)
    if (!medication) {
      throw new NotFoundException("Medication not found")
    }

    const newMedication = await this.medicationModel.update({ ...updateMedicationDto }, { where: { id }, returning: true })

    return new ResData('Staffs update by id', 200, newMedication[1][0])
  }

  async remove(id: number) {
    const deleted = await this.medicationModel.destroy({ where: { id } })
    if (!deleted) {
      throw new NotFoundException('Budna Medication mavjud emas')
    }
    return { message: `Medication o'chirildi` }
  }
}
