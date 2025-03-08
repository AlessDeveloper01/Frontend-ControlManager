import { Column, DataType, BelongsToMany, Model, Table, BelongsTo, ForeignKey } from "sequelize-typescript";
import OrderProduct from "./OrderProduct.entity";
import Product from "./Product.entity";


@Table({
    tableName: 'orders'
})

class Order extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: false
    }) 
    declare mesero: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare total: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare status: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare date: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    declare finishDate: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare methodPayment: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    declare numTable: number;

    @BelongsToMany(() => Product, () => OrderProduct)
    declare products: Product[];
}   

export default Order;