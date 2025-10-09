import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './model/payment.model';
import { Appointment } from '../appointments/model/appointment.model';
import { Patient } from '../patients/model/patient.model';

@Module({
  imports: [SequelizeModule.forFeature([Payment, Appointment, Patient])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
