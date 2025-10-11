import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './model/payment.model';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ResData } from '../lib/resData';
import { Appointment } from '../appointments/model/appointment.model';
import { Patient } from '../patients/model/patient.model';
import { where } from 'sequelize';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment) private readonly paymentModel: typeof Payment,
    @InjectModel(Appointment) private readonly appointmentModel: typeof Appointment,
    @InjectModel(Patient) private readonly patientModel: typeof Patient,
  ) { }

  async create(createPaymentDto: CreatePaymentDto): Promise<ResData<Payment>> {
    const {appointment_id, patient_id, amount, payment_method, payment_status, payment_date} = createPaymentDto

    if (appointment_id === undefined || patient_id === undefined || !amount || !payment_method || !payment_status || !payment_date) {
      throw new NotFoundException('Barchasini kiriting')
    }

    const appointment = await this.appointmentModel.findByPk(appointment_id)
    if (!appointment) {
      throw new NotFoundException('Bunday appointment_id topilmadi')
    }

    const patient = await this.patientModel.findByPk(patient_id)
    if (!patient) {
      throw new NotFoundException('Bunday patient_id topilmadi')
    }

    const newPayment = await this.paymentModel.create({ ...createPaymentDto });
    return new ResData('Payment created successfully', 201, newPayment);
  }

  async findAll(): Promise<ResData<Payment[]>> {
    const payments = await this.paymentModel.findAll({ include: { all: true }, order: [['id', 'ASC']] });
    return new ResData('Payments retrieved successfully', 200, payments);
  }

  async findOne(id: number): Promise<ResData<Payment>> {
    const payment = await this.paymentModel.findByPk(id, { include: { all: true } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return new ResData('Payment retrieved successfully', 200, payment);
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<ResData<Payment>> {
    const payment = await this.paymentModel.findByPk(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const {appointment_id, patient_id} = updatePaymentDto

    if (appointment_id) {
      const medical_record = await this.appointmentModel.findByPk(appointment_id)
      if (!medical_record) {
        throw new NotFoundException("Bunday appointment_id topilmadi")
      }
    }

    if (patient_id) {
      const patient = await this.patientModel.findByPk(patient_id)
      if (!patient) {
        throw new NotFoundException("Bunday patient_id topilmadi")
      }
    }

    const [_, [newPayment]] = await this.paymentModel.update({...updatePaymentDto}, {
      where: { id },
      returning: true,
    });


    return new ResData('Payment updated successfully', 200, newPayment);
  }

  async remove(id: number): Promise<ResData<null>> {
    const removed = await this.paymentModel.destroy({ where: { id } });
    if (!removed) {
      throw new NotFoundException('Payment not found');
    }
    return new ResData('Payment deleted successfully', 200, null);
  }
}
