import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
    tableName: 'users'
})

class User extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string;

    @Column({
        type: DataType.STRING(100),
        unique: true
    })
    declare email: string;

    @Column({
        type: DataType.STRING(100)
    })
    declare password: string;

    @Column({
        type: DataType.STRING(20)
    })
    declare permission: string;
}

export default User;