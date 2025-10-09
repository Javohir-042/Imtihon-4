import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Patient } from './model/patient.model';
import { LabTest } from '../lab-tests/model/lab-test.model';
import { MedicalRecord } from '../medical-records/model/medical-record.model';
import { Appointment } from '../appointments/model/appointment.model';
import { Payment } from '../payments/model/payment.model';

@Module({
  imports: [SequelizeModule.forFeature([Patient, LabTest, MedicalRecord, Appointment, Payment])],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule { }
