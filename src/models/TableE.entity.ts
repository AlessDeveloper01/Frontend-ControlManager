import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import Order from "./Order.entity";

@Table({
    tableName: "tables",
})
class TableE extends Model {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare numTable: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare status: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare capacity: string;

    @Column({
        type: DataType.STRING,
        defaultValue: "/img/tables/default.png",
    })
    declare image: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
        defaultValue: "",
    })
    declare qrCode: string;

    @HasMany(() => Order)
    declare orders: Order[];
}

export default TableE;