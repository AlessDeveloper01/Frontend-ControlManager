import bcrypt from 'bcrypt';

export class BcryptAdapter {

    static async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hashSync(password, salt);
    }

    static async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compareSync(password, hash);
    }

}