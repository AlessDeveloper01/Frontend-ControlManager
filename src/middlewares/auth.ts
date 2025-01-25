import { NextFunction, Request, Response } from "express";
import { JWTAdapter } from "../config";
import User from "../models/User.entity";


export class AuthProtect {
    static validateJWT = async (req: Request, res: Response, next: NextFunction) => {
        const authorization = req.header('Authorization');
        if(!authorization) {
            res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
            return;
        }

        if(!authorization.startsWith('Bearer ')) {
            res.status(401).json({ errors: [{msg: 'Invalid Bearer Token'}] });
            return;
        }
    
        const token = authorization.split(' ').at(1) || '';
    
        try {
            const payload = await JWTAdapter.verify<{ id: string, name: string, email: string, role: string }>(token);
            if(!payload) {
                res.status(401).json({ errors: [{msg: 'Invalid Token'}] });
                return;
            }
    
            const user = await User.findOne({ where: { id: payload.id } });
            if(!user) {
                res.status(401).json({
                    errors: [{msg: 'Invalid Token'}]
                })
                return;
            }
            const { password, ...userWithoutPassword } = user;
            req.body.user = userWithoutPassword;
    
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal server error' });
            return;
        }
    
    }
}