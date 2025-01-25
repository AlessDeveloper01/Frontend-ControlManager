import { Router } from "express";
import { AuthProtect } from "../../middlewares/auth";
import { OrderController } from "../../controllers";
import { ValidationsContents } from "../../validation";

export class OrderRoutes {
    static get routes() {
        const router = Router();

        router.post('/create', [AuthProtect.validateJWT, ValidationsContents.OrderNew], OrderController.create);
        router.get('/all', AuthProtect.validateJWT, OrderController.all);
        router.get('/get/:id', [AuthProtect.validateJWT, ValidationsContents.validationIdParam], OrderController.get);
        router.put('/update/:id', [AuthProtect.validateJWT, ValidationsContents.validationIdParam, ValidationsContents.OrderUpdate], OrderController.update);
        router.delete('/delete/:id', [AuthProtect.validateJWT, ValidationsContents.validationIdParam], OrderController.delete);
        router.put('/change-status/:id', [AuthProtect.validateJWT, ValidationsContents.validationIdParam, ValidationsContents.OrderChangeStatus], OrderController.changeStatus);

        return router;
    }
}