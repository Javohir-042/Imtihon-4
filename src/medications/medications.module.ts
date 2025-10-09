import { Module } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { MedicationsController } from './medications.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Medication } from './model/medication.model';
import { Prescription } from '../prescriptions/model/prescription.model';

@Module({
  imports: [SequelizeModule.forFeature([Medication, Prescription])],
  controllers: [MedicationsController],
  providers: [MedicationsService],
})
export class MedicationsModule { }
