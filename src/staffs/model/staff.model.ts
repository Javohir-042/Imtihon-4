import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { StaffEnum } from "../../common/enum/staffs.enum";
import { Patient } from "../../patients/model/patient.model";
import { Doctor } from "../../doctors/model/doctor.model";
import { StaffRole } from "../../staff_roles/model/staff_role.model";

interface StaffCreationAttrs {
    id?: number
    full_name: string;
    role: StaffEnum;
    phone: string;
    email: string;
    is_active: boolean;
    password : string
}

@Table({
    tableName: "staffs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})
export class Staff extends Model<Staff, StaffCreationAttrs> {
    @ApiProperty({
        example: 1,
        description: "Xodimning id",
    })
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;

    @ApiProperty({
        example: "Azizbek",
        description: "Xodimning to'liq ismi",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare full_name: string;

    @ApiProperty({
        example: StaffEnum.TECHNICIAN,
        description: "Xodimning roli ",
        enum: StaffEnum,
    })
    @Column({
        type: DataType.ENUM(...Object.values(StaffEnum)),
        allowNull: false,
    })
    declare role: StaffEnum;

    @ApiProperty({
        example: "+998999999999",
        description: "Xodimning telefon raqami",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare phone: string;

    @ApiProperty({
        example: "azizbek999@example.com",
        description: "Xodimning elektron pochtasi",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare email: string;

    @ApiProperty({
        example: true,
        description: "Xodim faol holatda ekanligini bildiradi",
    })
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    declare is_active: boolean;


    @ApiProperty({
        example: 'Javohir1234!',
        description: "Xodim paroli",
    })
    @Column({
        type: DataType.STRING,
        defaultValue: true,
    })
    declare password: string;

    

    @ForeignKey(() => Patient)
    @Column({
        type: DataType.INTEGER,
    })
    declare patient_id: number;

    @BelongsTo(() => Patient)
    declare patient: Patient;


    @HasMany(() => Doctor)
    declare doctor: Doctor[];

    @HasMany(() => StaffRole)
    declare staffRole: StaffRole[];

}
