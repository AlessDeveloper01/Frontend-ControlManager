import { Router } from "express";
import { AuthProtect } from "../../middlewares/auth";
import { ValidationsContents } from "../../validation";
import { TableController } from "../../controllers/table/controller";

export class TableRoutes {
    static get routes() {
        const router = Router();

        router.post("/create", [AuthProtect.validateJWT], TableController.create);
        router.get("/list", TableController.list);
        router.get(
            "/list/:id",
            [ValidationsContents.validationIdParam],
            TableController.listById
        );
        router.delete(
            "/delete/:id",
            [AuthProtect.validateJWT, ValidationsContents.validationIdParam],
            TableController.delete
        );
        router.put(
            "/update/:id",
            [AuthProtect.validateJWT, ValidationsContents.validationIdParam],
            TableController.update);
        
        router.get(
            "/qr/:id",
            [ValidationsContents.validationIdParam],
            TableController.getQrCode
        );

        return router;
    }
}
