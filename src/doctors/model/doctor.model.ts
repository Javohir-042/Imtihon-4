import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { LabTest } from "../../lab-tests/model/lab-test.model";
import { MedicalRecord } from "../../medical-records/model/medical-record.model";
import { Appointment } from "../../appointments/model/appointment.model";

interface IDoctorsCreateAttr {
    id?: number;
    full_name: string;
    specialization: string;
    password: string;
    phone: string;
    email: string;
    is_active: boolean;
}

@Table({
    tableName: "doctors",
    timestamps: true,
})
export class Doctor extends Model<Doctor, IDoctorsCreateAttr> {

    @ApiProperty({
        example: 1,
        description: "Shifokorning id",
    })
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;


    @ApiProperty({
        example: "Javohir Quromboyev",
        description: "Shifokorning to'liq ismi",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare full_name: string;


    @ApiProperty({
        example: "Cardiology",
        description: "Shifokorning ixtisosligi ",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare specialization: string;

    @ApiProperty({
        example: "Javohir123!",
        description: "doctor password",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;


    @ApiProperty({
        example: "+998888888888",
        description: "Shifokorning telefon raqami",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare phone: string;


    @ApiProperty({
        example: "javohir888@gmail.com",
        description: "Shifokorning elektron pochtasi",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare email: string;


    @ApiProperty({
        example: true,
        description: "Shifokor faol holatda yoki yo'qligi",
    })
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    declare is_active: boolean;


    @HasMany(() => LabTest)
    declare labTest: LabTest[];


    @HasMany(() => MedicalRecord)
    declare medicalRecord: MedicalRecord[];


    @HasMany(() => Appointment)
    declare appointment: Appointment[];
}
