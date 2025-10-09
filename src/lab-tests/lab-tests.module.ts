import { Module } from '@nestjs/common';
import { LabTestsService } from './lab-tests.service';
import { LabTestsController } from './lab-tests.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { LabTest } from './model/lab-test.model';
import { Doctor } from '../doctors/model/doctor.model';
import { Patient } from '../patients/model/patient.model';
import { MedicalRecord } from '../medical-records/model/medical-record.model';

@Module({
  imports: [SequelizeModule.forFeature([LabTest, Doctor, Patient, MedicalRecord])],
  controllers: [LabTestsController],
  providers: [LabTestsService],
})
export class LabTestsModule { }
