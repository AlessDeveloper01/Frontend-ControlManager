import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import Product from "./Product.entity";
import BoxProduct from "./BoxProduct.entity";

@Table({
    tableName: 'boxs'
})

class Box extends Model {
    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare date: Date;

    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    declare total: number;
    
    @BelongsToMany(() => Product,{
        through: () => BoxProduct,
        as: 'related_products' 
    })
    declare products: Product[];
}

export default Box;