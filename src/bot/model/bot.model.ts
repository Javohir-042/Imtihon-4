import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IBotCreationAttr {
    admin_id?: number;
    username?: string;
    first_name: string;
    last_name?: string;
    language_code?: string;
    // phone_number: string;
}

@Table({ tableName: 'bot' })
export class Bot extends Model<Bot, IBotCreationAttr> {
    @Column({
        type: DataType.BIGINT,
        primaryKey: true,
    })
    declare admin_id: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: true
    })
    declare username: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    declare first_name: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: true
    })
    declare last_name: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: true
    })
    declare language_code: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: true
    })
    declare phone_number: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare is_active: boolean;
}
