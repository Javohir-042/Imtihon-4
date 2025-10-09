import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Appointment } from './model/appointment.model';
import { Doctor } from '../doctors/model/doctor.model';
import { MedicalRecord } from '../medical-records/model/medical-record.model';
import { Patient } from '../patients/model/patient.model';
import { Payment } from '../payments/model/payment.model';

@Module({
  imports: [SequelizeModule.forFeature([Appointment, Doctor, MedicalRecord, Patient, Payment])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule { }
