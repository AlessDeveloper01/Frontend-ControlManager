import {
    Table,
    Model,
    Column,
    DataType,
    HasMany,
    BelongsToMany,
    ForeignKey,
    BelongsTo
} from "sequelize-typescript";
import Ingredient from "./Ingredient.entity";
import ProductIngredient from "./ProductIngredient.entity";
import Category from "./Category.entity";
import Order from "./Order.entity";
import OrderProduct from "./OrderProduct.entity";
import Box from "./Box.entity";
import BoxProduct from "./BoxProduct.entity";

@Table({
    tableName: 'products'
})
class Product extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    declare price: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    declare status: boolean;

    @BelongsToMany(() => Ingredient, () => ProductIngredient)
    declare ingredients: Ingredient[];

    @ForeignKey(() => Category)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare categoryId: number;

    @BelongsTo(() => Category, {
        as: 'category'
    })
    declare category: Category;

    @BelongsToMany(() => Order, () => OrderProduct)
    declare orders: Order[];

    @BelongsToMany(() => Box, () => BoxProduct)
    declare boxes: Box[];
}

export default Product;
