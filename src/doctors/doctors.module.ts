import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Doctor } from './model/doctor.model';
import { LabTest } from '../lab-tests/model/lab-test.model';
import { MedicalRecord } from '../medical-records/model/medical-record.model';
import { Appointment } from '../appointments/model/appointment.model';
import { Staff } from '../staffs/model/staff.model';

@Module({
  imports: [SequelizeModule.forFeature([Doctor, Staff, LabTest, MedicalRecord, Appointment])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports:[DoctorsService]
})
export class DoctorsModule { }
