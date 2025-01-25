import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import Product from "./Product.entity";

@Table({
    tableName: 'categories'
})
class Category extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    declare active: boolean;

    @HasMany(() => Product, {
        sourceKey: 'id',
        foreignKey: 'categoryId',
        as: 'products'
    })
    declare products: Product[];
}

export default Category;
