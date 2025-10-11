import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethodEnum, PaymentStatusEnum } from "../../common/enum/paymentMetod.enum";
import { Appointment } from "../../appointments/model/appointment.model";
import { Patient } from "../../patients/model/patient.model";

export interface IPayment {
    id?: number;
    appointment_id: number;
    patient_id: number;
    amount: number;
    payment_method: PaymentMethodEnum;
    payment_status: PaymentStatusEnum;
    payment_date: string;
}

@Table({
    tableName: "payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
})
export class Payment extends Model<Payment, IPayment> {
    @ApiProperty({
        example: 1,
        description: "To'lov ID"
    })
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    declare id: number;

    // ------------------------------------------

    @ApiProperty({
        example: 1,
        description: "Uchrashuv (Appointment) ID"
    })
    @ForeignKey(() => Appointment)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare appointment_id: number;

    @BelongsTo(() => Appointment)
    declare appointment: Appointment;



    @ApiProperty({
        example: 1,
        description: "Bemor ID"
    })
    @ForeignKey(() => Patient)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare patient_id: number;

    @BelongsTo(() => Patient)
    declare patient: Patient;

    // ---------------------------------------------

    @ApiProperty({
        example: 150000,
        description: "To'lov miqdori"
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare amount: number;


    @ApiProperty({
        example: PaymentMethodEnum.CARD,
        enum: PaymentMethodEnum,
        description: "To'lov usuli"
    })
    @Column({
        type: DataType.ENUM(...Object.values(PaymentMethodEnum)),
        allowNull: false
    })
    declare payment_method: PaymentMethodEnum;


    @ApiProperty({
        example: PaymentStatusEnum.PAID,
        enum: PaymentStatusEnum,
        description: "To'lov holati"
    })
    @Column({
        type: DataType.ENUM(...Object.values(PaymentStatusEnum)),
        allowNull: false
    })
    declare payment_status: PaymentStatusEnum;

    
    @ApiProperty({
        example: "2025-10-10",
        description: "To'lov sanasi (YYYY-MM-DD formatda)"
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: false
    })
    declare payment_date: string;
}
