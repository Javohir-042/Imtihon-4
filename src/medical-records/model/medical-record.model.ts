import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Doctor } from "../../doctors/model/doctor.model";
import { Appointment } from "../../appointments/model/appointment.model";
import { Patient } from "../../patients/model/patient.model";
import { LabTest } from "../../lab-tests/model/lab-test.model";
import { Prescription } from "../../prescriptions/model/prescription.model";

export interface IMedicalRecord {
    id?: number;
    doctor_id: number;
    appointment_id: number;
    patient_id: number;
    diagnosis: string;
    symptoms: string;
    treatment: string;
    record_date: Date;
}

@Table({
    tableName: "medical_records",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
})
export class MedicalRecord extends Model<MedicalRecord, IMedicalRecord> {
    @ApiProperty({
        example: 1,
        description: "Tibbiy yozuv ID"
    })
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    declare id: number;

    // ---------------------------------

    @ApiProperty({
        example: 1,
        description: "Shifokor ID"
    })
    @ForeignKey(() => Doctor)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare doctor_id: number;

    @BelongsTo(() => Doctor)
    declare doctor: Doctor;



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

    // --------------------------------------

    @ApiProperty({
        example: "O'pka yallig'lanishi",
        description: "Tashxis"
    })
    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare diagnosis: string;


    @ApiProperty({
        example: "Isitma, yo'tal, nafas qisishi",
        description: "Belgilar (Symptoms)"
    })
    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare symptoms: string;


    @ApiProperty({
        example: "Antibiotik kursi, dam olish",
        description: "Davolash yo'riqnomasi"
    })
    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare treatment: string;


    @ApiProperty({
        example: "2025-10-10",
        description: "Tibbiy yozuv sanasi (YYYY-MM-DD formatda)"
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: false
    })
    declare record_date: Date;


    @HasMany(() => LabTest)
    declare labTests: LabTest[];

    @HasMany(() => Prescription)
    declare prescriptions: Prescription[];
}
