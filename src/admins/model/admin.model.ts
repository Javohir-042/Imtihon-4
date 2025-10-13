import { Column, DataType, Model, Table } from "sequelize-typescript";
import { Role } from "../../common/enum/admin.enum";
import { ApiProperty } from "@nestjs/swagger";

interface IAdminCreationAttr {
  id?: number;
  full_name: string;
  email: string;
  username: string;
  password: string;
  role: Role;
  is_active: boolean;
}

@Table({
  tableName: "admin",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export class Admin extends Model<Admin, IAdminCreationAttr> {
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


  @ApiProperty({
    example: "Javohir Quromboyev",
    description: "Adminning ism familiyasi",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare full_name: string;


  @ApiProperty({
    example: "javohirquromboyev933@gmail.com",
    description: "Adminning email manzili",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;


  @ApiProperty({
    example: "javohir-042",
    description: "Admin username",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare username: string;


  @ApiProperty({
    example: "Javohir123!",
    description: "Admin password",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;


  @Column({
    type: DataType.ENUM(...Object.values(Role)),
    allowNull: false,
    defaultValue: Role.ADMIN,
  })
  declare role: Role;


  @ApiProperty({
    example: true,
    description: `Admin aktive yoki yo'qligini bildiradi`,
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare is_active: boolean;


  @Column({
    type: DataType.STRING(2000),
  })
  declare refresh_token: string;

}
