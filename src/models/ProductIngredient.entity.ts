import { Table, Model, ForeignKey, Column, DataType } from "sequelize-typescript";
import Product from "./Product.entity";
import Ingredient from "./Ingredient.entity";

@Table({
    tableName: 'product_ingredients'
})
class ProductIngredient extends Model {
    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare productId: number;

    @ForeignKey(() => Ingredient)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare ingredientId: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 1
    })
    declare quantity: number;
}

export default ProductIngredient;
