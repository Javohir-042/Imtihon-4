import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { MedicalRecord } from "../../medical-records/model/medical-record.model";
import { Medication } from "../../medications/model/medication.model";

export interface IPrescription {
    id?: number;
    medical_record_id: number;
    medication_id: number;
    dosage: string;
    frequency: string;
    duration_days: number;
    prescribed_date: string;
}

@Table({
    tableName: "prescriptions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
})
export class Prescription extends Model<Prescription, IPrescription> {

    @ApiProperty({
        example: 1,
        description: "Prescription ID"
    })
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    declare id: number;

    // -------------------------------------------------

    @ApiProperty({
        example: 1,
        description: "Tibbiy yozuv (Medical Record) ID"
    })
    @ForeignKey(() => MedicalRecord)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare medical_record_id: number;

    @BelongsTo(() => MedicalRecord)
    declare medicalRecord: MedicalRecord;


    @ApiProperty({
        example: 1,
        description: "Dori (Medication) ID"
    })
    @ForeignKey(() => Medication)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare medication_id: number;

    @BelongsTo(() => Medication)
    declare medication: Medication;

    // ------------------------------------------

    @ApiProperty({
        example: "500mg",
        description: "Dozalash (dosage)"
    })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare dosage: string;


    @ApiProperty({
        example: "Kuniga 3 marta",
        description: "Qabul qilish chastotasi (frequency)"
    })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare frequency: string;


    @ApiProperty({
        example: 7,
        description: "Davolanish muddati (kunlarda)"
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare duration_days: number;


    @ApiProperty({
        example: "2025-10-10",
        description: "Buyurilgan sana (YYYY-MM-DD formatda)"
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: false
    })
    declare prescribed_date: string;

}
