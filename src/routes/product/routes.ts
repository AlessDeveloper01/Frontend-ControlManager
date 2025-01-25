import { Router } from "express";
import { ProductController } from "../../controllers";
import { AuthProtect } from "../../middlewares/auth";
import { ValidationsContents } from "../../validation";

export class ProductRoutes {
    static get routes() {
        const router = Router();

        router.post("/create", [AuthProtect.validateJWT, ValidationsContents.ProductNew], ProductController.create);
        router.get("/list", [AuthProtect.validateJWT], ProductController.list);
        router.get("/list/:id", [AuthProtect.validateJWT, ValidationsContents.validationIdParam], ProductController.get);
        router.delete("/delete/:id", [AuthProtect.validateJWT, ValidationsContents.validationIdParam], ProductController.delete);
        router.put("/update/:id", [AuthProtect.validateJWT, ValidationsContents.ProductUpdate], ProductController.update);
        router.get('get-name/:name', [AuthProtect.validateJWT], ProductController.getByName);

        return router;
    }
}