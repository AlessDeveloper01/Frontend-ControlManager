import { Table, Model, Column, DataType, BelongsToMany } from "sequelize-typescript";
import Product from "./Product.entity";
import ProductIngredient from "./ProductIngredient.entity";

@Table({
    tableName: 'ingredients'
})
class Ingredient extends Model {
    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.INTEGER
    })
    declare quantity: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    declare status: boolean;

    @BelongsToMany(() => Product, () => ProductIngredient)
    declare products: Product[];
}

export default Ingredient;
