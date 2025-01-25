import { Router } from "express";
import { BoxController } from "../../controllers";
import { AuthProtect } from "../../middlewares/auth";
import { ValidationsContents } from "../../validation";

export class BoxRoutes {
    static get routes() {
        const router = Router();

        router.post('/create', [AuthProtect.validateJWT], BoxController.create);
        router.get('/list', [AuthProtect.validateJWT], BoxController.list);
        router.get('/list/:id', [AuthProtect.validateJWT, ValidationsContents.validationIdParam], BoxController.listById);
        router.delete('/delete/:id', [AuthProtect.validateJWT, ValidationsContents.validationIdParam], BoxController.delete);

        return router;
    }
}