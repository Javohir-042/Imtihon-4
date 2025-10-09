import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { GenderEnum } from "../../common/enum/gender.enum";
import { LabTest } from "../../lab-tests/model/lab-test.model";
import { MedicalRecord } from "../../medical-records/model/medical-record.model";
import { Appointment } from "../../appointments/model/appointment.model";
import { Payment } from "../../payments/model/payment.model";

export interface IPatient {
    id?: number;
    full_name: string;
    data_of_birth: Date;
    gender: GenderEnum;
    phone: string;
    address: string;
    blood_group: string;

    createdAt?: Date;
    updatedAt?: Date;
}

@Table({
    tableName: "patients",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
})
export class Patient extends Model<Patient, IPatient> {
    @ApiProperty({
        example: 1,
        description: "Bemor ID"
    })
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    declare id: number;


    @ApiProperty({
        example: "Javohir Quromboyev",
        description: "Bemorning to'liq ismi"
    })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare full_name: string;


    @ApiProperty({
        example: "2000-05-10",
        description: "Tug'ilgan sana (YYYY-MM-DD formatda)"
    })
    @Column({
        type: DataType.DATEONLY,
        allowNull: false
    })
    declare data_of_birth: Date;


    @ApiProperty({
        example: GenderEnum.MALE,
        enum: GenderEnum,
        description: "Jins"
    })
    @Column({
        type: DataType.ENUM(...Object.values(GenderEnum)),
        allowNull: false
    })
    declare gender: GenderEnum;


    @ApiProperty({
        example: "+998906666666",
        description: "Telefon raqam"
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    declare phone: string;


    @ApiProperty({
        example: "Toshkent sh., Chilonzor tumani",
        description: "Manzil"
    })
    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare address: string;


    @ApiProperty({
        example: "|||",
        description: "Qon guruhi"
    })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare blood_group: string;



    @HasMany(() => Appointment)
    declare appointments: Appointment[];

    @HasMany(() => MedicalRecord)
    declare medicalRecords: MedicalRecord[];

    @HasMany(() => LabTest)
    declare labTests: LabTest[];

    @HasMany(() => Payment)
    declare payments: Payment[];
}
