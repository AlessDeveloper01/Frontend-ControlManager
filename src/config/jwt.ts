import jwt from 'jsonwebtoken';
import { envs } from './envs';

export class JWTAdapter {
    static async sign(payload: any): Promise<string> {
        return jwt.sign(payload, envs.JWT_KEY, { expiresIn: '30d' });
    }

    static verify<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, envs.JWT_KEY, (err, decoded) => {
                if(err) {
                    return resolve(null);
                }
                resolve(decoded as T);
            })
        });
    }
}