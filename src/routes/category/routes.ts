import { Router } from "express";
import { CategoryController } from "../../controllers";
import { AuthProtect } from "../../middlewares/auth";
import { ValidationsContents } from "../../validation";

export class CategoryRoutes {
    
    static get routes() {
        const router = Router();
        
        router.post('/create', [AuthProtect.validateJWT, ValidationsContents.CategoryNew], CategoryController.create);
        router.get('/all', CategoryController.getAll);
        router.get('/get/:id', [ValidationsContents.validationIdParam], CategoryController.getById);
        router.delete('/delete/:id', [AuthProtect.validateJWT], CategoryController.delete);
        router.put('/update/:id', [AuthProtect.validateJWT, ValidationsContents.validationIdParam, ValidationsContents.CategoryUpdate],CategoryController.update);
        router.get('/search', AuthProtect.validateJWT, CategoryController.search);
        router.get('/get-name/:name', CategoryController.getByName);
        
        return router;
    }

}