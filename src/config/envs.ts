import 'dotenv/config';
import { get } from "env-var";

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    DATABASE_URL: get('databaseUrl').required().asString(),
    JWT_KEY: get('JWT_KEY').required().asString(),
    URL_FRONTEND: get('URL_FRONTEND').asString(),
}