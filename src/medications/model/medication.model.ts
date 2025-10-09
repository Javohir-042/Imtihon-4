import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Prescription } from "../../prescriptions/model/prescription.model";

export interface IMedication {
    id?: number;
    name: string;
    category: string;
    unit_price: number;
    unit: string;
    stock_quantity: number;
    is_available: boolean;
}

@Table({
    tableName: "medications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
})
export class Medication extends Model<Medication, IMedication> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    declare id: number;


    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string;


    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare category: string;


    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare unit_price: number;


    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare unit: string;


    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare stock_quantity: number;


    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true
    })
    declare is_available: boolean;

    @HasMany(() => Prescription)
    declare prescription: Prescription[];
}
