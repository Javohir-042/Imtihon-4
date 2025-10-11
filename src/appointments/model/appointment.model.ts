import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Doctor } from "../../doctors/model/doctor.model";
import { Patient } from "../../patients/model/patient.model";
import { MedicalRecord } from "../../medical-records/model/medical-record.model";
import { Payment } from "../../payments/model/payment.model";
import { AppEnum } from "../../common/enum/app.enum";

export interface IAppointment {
    id?: number;
    doctor_id: number;
    patient_id: number;
    appointment_date: string;
    appointment_time: string;
    status: AppEnum;
    reason: string;
}

@Table({
    tableName: "appointments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
})
export class Appointment extends Model<Appointment, IAppointment> {

    @ApiProperty({
        example: 1,
        description: "appointment ID"
    })
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;



    @ApiProperty({
        example: 1,
        description: "Shifokor ID"
    })
    @ForeignKey(() => Doctor)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare doctor_id: number;

    @BelongsTo(() => Doctor)
    declare doctor: Doctor;




    @ApiProperty({
        example: 2,
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



    @ApiProperty({
        example: "2025-10-10",
        description: "Uchrashuv sanasi (YYYY-MM-DD formatda)"
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: false
    })
    declare appointment_date: string;


    @ApiProperty({
        example: "14:30",
        description: "Uchrashuv vaqti (HH:MM formatda)"
    })
    @Column({
        type: DataType.TIME,
        allowNull: false
    })
    declare appointment_time: string;


    @ApiProperty({
        example: AppEnum.PENDING,
        enum: AppEnum,
        description: "Uchrashuv holati"
    })
    @Column({
        type: DataType.ENUM(...Object.values(AppEnum)),
        allowNull: false,
        defaultValue: AppEnum.PENDING
    })
    declare status: AppEnum;


    @ApiProperty({
        example: "Yillik tekshiruv",
        description: "Uchrashuv sababi"
    })
    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare reason: string;



    @HasMany(() => MedicalRecord)
    declare medicalRecord: MedicalRecord[];

    @HasMany(() => Payment)
    declare payment: Payment[];
}
