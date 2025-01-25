import { Table, Model, ForeignKey, Column, DataType } from "sequelize-typescript";
import Product from "./Product.entity";
import Order from "./Order.entity";

@Table({
    tableName: 'order_products'
})

class OrderProduct extends Model {
    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare productId: number;

    @ForeignKey(() => Order)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare orderId: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare quantity: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    declare price: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    declare total: number;
}

export default OrderProduct;
