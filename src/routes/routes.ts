import { Router } from "express";
import { UserRoutes } from "./user/routes";
import { IngredientRoutes } from "./ingredient/routes";
import { CategoryRoutes } from "./category/routes";
import { ProductRoutes } from "./product/routes";
import { OrderRoutes } from "./order/routes";
import { BoxRoutes } from "./box/routes";
import { TableRoutes } from "./table/routes";

export class AppRoutes {
    static get routes() {
        const router = Router();
        
        router.use('/api/auth', UserRoutes.routes);
        router.use('/api/ingredient', IngredientRoutes.routes);
        router.use('/api/category', CategoryRoutes.routes);
        router.use('/api/product', ProductRoutes.routes);
        router.use('/api/order', OrderRoutes.routes);
        router.use('/api/box', BoxRoutes.routes);
        router.use('/api/table', TableRoutes.routes);

        return router;
    }
}