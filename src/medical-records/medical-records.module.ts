import { Module } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { MedicalRecordsController } from './medical-records.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { MedicalRecord } from './model/medical-record.model';
import { Doctor } from '../doctors/model/doctor.model';
import { Appointment } from '../appointments/model/appointment.model';
import { Patient } from '../patients/model/patient.model';
import { LabTest } from '../lab-tests/model/lab-test.model';

@Module({
  imports: [SequelizeModule.forFeature([MedicalRecord, Doctor, Appointment, Patient, LabTest, Patient])],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService],
})
export class MedicalRecordsModule { }
