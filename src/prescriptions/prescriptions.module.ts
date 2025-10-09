import { Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Prescription } from './model/prescription.model';
import { MedicalRecord } from '../medical-records/model/medical-record.model';
import { Medication } from '../medications/model/medication.model';

@Module({
  imports: [SequelizeModule.forFeature([Prescription, MedicalRecord, Medication])],
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService],
})
export class PrescriptionsModule { }
