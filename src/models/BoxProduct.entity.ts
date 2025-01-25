import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Box from "./Box.entity";
import Product from "./Product.entity";

@Table({
    tableName: 'box_products'
})

class BoxProduct extends Model {
    @ForeignKey(() => Box)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    boxId: number;

    @ForeignKey(() => Product)
    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    productId: number;

    @Column({
        allowNull: false,
        type: DataType.INTEGER
    })
    quantity: number;

    @Column({
        allowNull: false,
        type: DataType.FLOAT
    })
    price: number;

    @Column({
        allowNull: false,
        type: DataType.FLOAT
    })
    total: number;
}

export default BoxProduct;