import { envs } from './config';
import { PostgresDatabase } from './database/PostgresDatabase';
import { Server } from './server';

(() => {
    main();
})();

async function main() {
    const port = envs.PORT;

    await PostgresDatabase.connect();

    new Server().start(port);
}