import express, { Application, Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import colors from 'colors';
import cors from 'cors';
import { AppRoutes } from './routes/routes';

export class Server {
    private app: Application;
    private server: any;
    private io: SocketServer;
 
    constructor() {
        this.app = express()
        this.server = createServer(this.app)
        this.io = new SocketServer(this.server, {
            cors: {
                origin: ['*', 'http://localhost:3000', 'https://systemlaperla.vercel.app'],
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
            },
            connectTimeout: 5000,
            pingTimeout: 5000,
            pingInterval: 10000,
        });
    }



    public start(port: number) {
        this.app.use(cors({
            origin: ['*', 'http://localhost:3000', 'https://systemlaperla.vercel.app'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        }));

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use((req: Request, _res: Response, next: NextFunction) => {
            (req as any).io = this.io;
            console.log(colors.cyan("Middleware Socket.IO configurado"));
            next();
        });

        this.app.use(AppRoutes.routes);

        this.server.listen(port, () => {
            console.log(colors.bgBlue.white.bold(`Server started at http://localhost:${port}`));
            console.log(colors.bgGreen.cyan.bold('Socket.IO server is ready for connections'));
        });
    }
}