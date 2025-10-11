import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { LabTest } from "../../lab-tests/model/lab-test.model";
import { MedicalRecord } from "../../medical-records/model/medical-record.model";
import { Appointment } from "../../appointments/model/appointment.model";
import { Staff } from "../../staffs/model/staff.model";

interface IDoctorsCreateAttr {
    id?: number;
    specialization: string;
    staffs_id: number;
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
        example: "Cardiology",
        description: "Shifokorning ixtisosligi ",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare specialization: string;

    @ApiProperty({
        example: 1,
        description: 'staffs id'
    })
    @ForeignKey(() => Staff)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare staffs_id: number;

    @BelongsTo(() => Staff)
    declare staff: Staff;

    
    @HasMany(() => LabTest)
    declare labTest: LabTest[];


    @HasMany(() => MedicalRecord)
    declare medicalRecord: MedicalRecord[];


    @HasMany(() => Appointment)
    declare appointment: Appointment[];
}
