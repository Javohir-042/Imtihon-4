import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { StaffRole } from "../../staff_roles/model/staff_role.model";

interface IRoleCreateAttr {
    id?: number;
    role_name: string;
    new_column?: string;
}

@Table({ tableName: "roles", timestamps: false })
export class Role extends Model<Role, IRoleCreateAttr> {
    @ApiProperty({
        example: 1,
        description: "Rolning noyob identifikatori (id)",
    })
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;

    @ApiProperty({
        example: "ADMIN",
        description: "Roli nomi (masalan: ADMIN, STAFF, PATIENT)",
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare role_name: string;

    @ApiProperty({
        example: "Qo'shimcha ma'lumot ustuni",
        description: "Rollar haqida qo'shimcha izoh yoki meta-ma'lumot",
        required: false,
    })
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare new_column?: string;

    
    @HasMany(() => StaffRole)
    declare staff_roles: StaffRole[];
}
