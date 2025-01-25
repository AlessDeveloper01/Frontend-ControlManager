import { Router } from "express";
import { UserController } from "../../controllers";
import { ValidationsContents } from "../../validation";
import { AuthProtect } from "../../middlewares/auth";

export class UserRoutes {
    static get routes() {
        const router = Router();

        router.post('/register', [AuthProtect.validateJWT, ValidationsContents.UserNew], UserController.register);
        router.post('/login', ValidationsContents.UserLogin, UserController.login);
        router.get('/me', AuthProtect.validateJWT, UserController.me);
        router.get('/all', AuthProtect.validateJWT, UserController.all);
        router.delete('/delete/:id', [AuthProtect.validateJWT, ValidationsContents.validationIdParam], UserController.delete);
        router.put('/update/:id', [AuthProtect.validateJWT, ValidationsContents.validationIdParam], UserController.update);

        return router;
    }  
}