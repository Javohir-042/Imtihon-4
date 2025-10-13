import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { GenderEnum } from "../../common/enum/gender.enum";
import { LabTest } from "../../lab-tests/model/lab-test.model";
import { MedicalRecord } from "../../medical-records/model/medical-record.model";
import { Appointment } from "../../appointments/model/appointment.model";
import { Payment } from "../../payments/model/payment.model";
import { Staff } from "../../staffs/model/staff.model";
import { IsDateString, IsNotEmpty } from "class-validator";

export interface IPatient {
    id?: number;
    full_name: string;
    password: string;
    email: string;
    date_of_birth: Date;
    gender: GenderEnum;
    phone: string;
    address: string;
    blood_group: string;
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

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare email: string;

    @ApiProperty({
        description: "Tug'ilgan sana (YYYY-MM-DD formatda)",
        example: "2000-05-10",
    })
    @IsDateString()
    @IsNotEmpty()
    @Column({
        type: DataType.DATEONLY,
        allowNull: false
    })
    declare date_of_birth: string;


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
        example: "O+",
        description: "Qon guruhi"
    })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare blood_group: string;

    @ApiProperty({
        example: 'Javohir123!',
        description: "Password"
    })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare password: string;

    @HasMany(() => Appointment)
    declare appointments: Appointment[];

    @HasMany(() => MedicalRecord)
    declare medicalRecords: MedicalRecord[];

    @HasMany(() => LabTest)
    declare labTests: LabTest[];

    @HasMany(() => Payment)
    declare payments: Payment[];

    @HasMany(() => Staff)
    declare staff: Staff[];


    @Column({
        type: DataType.STRING(2000),
    })
    declare refresh_token: string;


}
