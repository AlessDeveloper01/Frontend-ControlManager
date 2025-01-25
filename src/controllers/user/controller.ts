import { Request, RequestHandler, Response } from "express"
import User from "../../models/User.entity"
import { CustomError } from "../../middlewares"
import { BcryptAdapter, JWTAdapter } from "../../config"

export class UserController {
    static register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { dataValues } = req.body.user;

            if(dataValues.permission !== 'Administrador') {
                throw CustomError.forbidden('No tienes permisos para realizar esta acción');
            }

            const { email } = req.body

            const userExists = await User.findOne({ where: { email } });

            if(userExists) {
                throw CustomError.badRequest('Ocurrió un error al registrar el usuario');
            }

            const passwordHashed = await BcryptAdapter.hash(req.body.password);

            const user = new User({ ...req.body, password: passwordHashed });
            await user.save();

            res.status(201).json({ msg: 'Usuario creado correctamente' });
        } catch (error) { 
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [{ msg: error.message }] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [{ msg: internalError.message}] });
            }
        }
    }

    static login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });
            if(!user) {
                throw CustomError.notFound('Usuario incorrecto');
            }

            const passwordMatch = await BcryptAdapter.compare(password, user.password);
            if(!passwordMatch) {
                throw CustomError.badRequest('Usuario o contraseña incorrectos');
            }

            const token = await JWTAdapter.sign({ id: user.id, email: user.email, role: user.permission, name: user.name });

            res.status(200).json({ token });

        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [{ msg: error.message }] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [{ msg: internalError.message}] });
            }
        }
    }

    static me: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { dataValues } = req.body.user;

            const user = await User.findOne({ where: { id: dataValues.id } });

            if(!user) {
                throw CustomError.notFound('Usuario no encontrado');
            }

            const { password, ...userWithoutPassword } = user.dataValues;
            res.status(200).json({ user: userWithoutPassword });
        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [{ msg: error.message }] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [{ msg: internalError.message}] });
            }
        }
    }
    
    static all: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await User.findAll();
            const usersWithoutPassword = users.map(user => {
                const { password, ...userWithoutPassword } = user.dataValues;
                return userWithoutPassword;
            });
            res.status(200).json({ usersWithoutPassword });
        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [{ msg: error.message }] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [{ msg: internalError.message}] });
            }
        }
    }

    static delete: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { dataValues } = req.body.user;

            if(dataValues.permission !== 'Administrador') {
                throw CustomError.forbidden('No tienes permisos para realizar esta acción');
            }

            const { id } = req.params;

            const user = await User.findOne({ where: { id } });

            if(!user) {
                throw CustomError.notFound('Usuario no encontrado');
            }

            if(user.id === dataValues.id) {
                throw CustomError.badRequest('No puedes eliminar tu cuenta');
            }

            if(user.permission === 'Administrador') {
                throw CustomError.badRequest('No puedes eliminar a un administrador');
            }

            await user.destroy();

            res.status(200).json({ msg: 'Usuario eliminado correctamente' });
        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [{ msg: error.message }] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [{ msg: internalError.message}] });
            }
        }
    }

    static update: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { dataValues } = req.body.user;

            if(dataValues.permission !== 'Administrador') {
                throw CustomError.forbidden('No tienes permisos para realizar esta acción');
            }

            const { id } = req.params;

            const user = await User.findOne({ where: { id } });

            if(!user) {
                throw CustomError.notFound('Usuario no encontrado');
            }

            if(user.id === dataValues.id) {
                throw CustomError.badRequest('No puedes modificar tu cuenta');
            }

            if(user.permission === 'Administrador') {
                throw CustomError.badRequest('No puedes modificar a un administrador');
            }

            if(req.body.password) {
                req.body.password = await BcryptAdapter.hash(req.body.password);
            }

            await user.update(req.body);

            res.status(200).json({ msg: 'Usuario actualizado correctamente' });
        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [{ msg: error.message }] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [{ msg: internalError.message}] });
            }
        }
    }
}