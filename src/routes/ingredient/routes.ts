import { Router } from "express";
import { AuthProtect } from "../../middlewares/auth";
import { IngredientController } from "../../controllers/ingredient/controller";
import { ValidationsContents } from "../../validation";
import { param } from "express-validator";

export class IngredientRoutes {
    static get routes() {
        const router = Router();

        router.post('/create', [AuthProtect.validateJWT, ValidationsContents.IngredientNew], IngredientController.create);
        router.get('/list', IngredientController.list);
        router.get('/list/:id', ValidationsContents.validationIdParam, IngredientController.listById);
        router.put('/update/:id', [AuthProtect.validateJWT, ValidationsContents.validationIdParam, ValidationsContents.IngredientUpdate], IngredientController.update);
        router.delete('/delete/:id', [AuthProtect.validateJWT, ValidationsContents.validationIdParam], IngredientController.delete);

        return router;
    }
}