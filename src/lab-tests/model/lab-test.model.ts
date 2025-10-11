import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { AppEnum } from "../../common/enum/app.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Doctor } from "../../doctors/model/doctor.model";
import { Patient } from "../../patients/model/patient.model";
import { MedicalRecord } from "../../medical-records/model/medical-record.model";

export interface ILabTest {
    id?: number;
    doctor_id: number;
    patient_id: number;
    medical_record_id: number;
    test_name: string;
    test_date: string;
    status: AppEnum;
    cost: number;
    result: string;
}

@Table({
    tableName: "lab_tests",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
})
export class LabTest extends Model<LabTest, ILabTest> {
    @ApiProperty({
        example: 1,
        description: "Lab test ID"
    })
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    declare id: number;

    // ---------------------------------------

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
        example: 1,
        description: "Tibbiy yozuv ID"
    })
    @ForeignKey(() => MedicalRecord)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare medical_record_id: number;

    @BelongsTo(() => MedicalRecord)
    declare medicalRecord: MedicalRecord;

    // --------------------------------------------------------

    @ApiProperty({
        example: "Qon tahlili",
        description: "Test nomi"
    })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare test_name: string;


    @ApiProperty({
        example: "2025-10-10",
        description: "Test sanasi (YYYY-MM-DD formatda)"
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: false
    })
    declare test_date: string;


    @ApiProperty({
        example: AppEnum.PENDING,
        enum: AppEnum,
        description: "Test holati"
    })
    @Column({
        type: DataType.ENUM(...Object.values(AppEnum)),
        allowNull: false,
        defaultValue: AppEnum.PENDING
    })
    declare status: AppEnum;


    @ApiProperty({
        example: 150000,
        description: "Test narxi"
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare cost: number;


    @ApiProperty({
        example: "Natija normal",
        description: "Test natijasi"
    })
    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare result: string;

}
