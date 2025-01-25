import { Sequelize } from "sequelize-typescript";
import { envs } from "../config";
import colors from 'colors';

export class PostgresDatabase {

    private readonly sequelize: Sequelize;
    
    constructor() {
        this.sequelize = new Sequelize(envs.DATABASE_URL, {
            models: [__dirname + '/../models/**/*'],
        })
    }

    static async connect() {
        try {
            await new PostgresDatabase().sequelize.sync();
            console.log(colors.bgGreen.white.italic('Database connected'));
        } catch (error) {
            console.error(colors.bgRed.white.italic('Database connection error: ' + error));
        }
    }

}