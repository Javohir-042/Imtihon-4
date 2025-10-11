import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Staff } from "../../staffs/model/staff.model";
import { Role } from "../../roles/model/role.model";

interface IStaffRoleCreateAttr {
    id?: number;
    staff_id: number;
    role_id: number;
}

@Table({ tableName: 'staff-roles'})
export class StaffRole extends Model<StaffRole, IStaffRoleCreateAttr> {
    @ApiProperty({
        example: 1,
        description: "Admin id",
    })
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;


    @ForeignKey(() => Staff)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare staff_id: number

    @BelongsTo(() => Staff)
    declare staff: Staff;


    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare role_id: number

    @BelongsTo(() => Role)
    declare role: Role;
}
