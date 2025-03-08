import { Request, Response, NextFunction } from "express"
import { body, param, validationResult } from "express-validator"

export class ValidationsContents {
    static UserNew = async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all([
            body('name').isString().withMessage('El nombre debe ser caracteres').notEmpty().withMessage('El nombre es requerido').run(req),
            body('email').isEmail().withMessage('El email no es valido').notEmpty().withMessage('El email es requerido').run(req),
            body('password').notEmpty().withMessage('La contraseña es requerida').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres').run(req),
            body('permission').isString().withMessage('El permiso debe ser caracteres').notEmpty().withMessage('El permiso es requerido').run(req)
        ]);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        } 

        next();
    } 

    static UserLogin = async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all([
            body('email').isEmail().withMessage('El email no es valido').notEmpty().withMessage('El email es requerido').run(req),
            body('password').notEmpty().withMessage('La contraseña es requerida').run(req)
        ]);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        } 

        next();
    }

    static IngredientNew = async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all([
            body('name').isString().withMessage('El nombre debe ser caracteres').notEmpty().withMessage('El nombre es requerido').run(req),
            body('quantity').isNumeric().withMessage('La cantidad debe ser un numero').notEmpty().withMessage('La cantidad es requerida').run(req),
        ])

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        next();
    }

    static IngredientUpdate = async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all([
            body('name').optional().isString().withMessage('El nombre debe ser caracteres').run(req),
            body('quantity').optional().isNumeric().withMessage('La cantidad debe ser un numero').run(req),
            body('status').optional().isBoolean().withMessage('El estado debe ser true/false').run(req),
        ])

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        next();
    }

    static validationIdParam = async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all([
            param('id').isNumeric().withMessage('El id debe ser un numero').notEmpty().withMessage('El id es requerido').run(req)
        ]);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        next();
    }

    static CategoryNew = async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all([
            body('name').isString().withMessage('El nombre debe ser caracteres').notEmpty().withMessage('El nombre es requerido').run(req)
        ])

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        next();
    }

    static CategoryUpdate = async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all([
            body('name').isString().withMessage('El nombre debe ser caracteres').notEmpty().withMessage('El nombre es requerido').optional().run(req),
            body('active').isBoolean().withMessage('El estado debe ser true/false').notEmpty().withMessage('El estado es requerido').optional().run(req)
        ])

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        next();
    }

    static ProductNew = async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all([
            body('name').isString().withMessage('El nombre debe ser caracteres').notEmpty().withMessage('El nombre es requerido').run(req),
            body('price').isNumeric().withMessage('El precio debe ser un numero').notEmpty().withMessage('El precio es requerido').run(req),
            body('categoryId').isNumeric().withMessage('La categoria debe ser un numero').notEmpty().withMessage('La categoria es requerida').run(req),
            body('ingredients').isArray().withMessage('Los ingredientes debe ser un arreglo').optional().run(req)
        ])

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        next();
    }

    static ProductUpdate = async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all([
            body('name').optional().isString().withMessage('El nombre debe ser caracteres').run(req),
            body('price').optional().isNumeric().withMessage('El precio debe ser un numero').run(req),
            body('categoryId').optional().isNumeric().withMessage('La categoria debe ser un numero').run(req),
            body('ingredients').optional().isArray().withMessage('Los ingredientes debe ser un arreglo').run(req),
            body('active').optional().isBoolean().withMessage('El estado debe ser true/false').run(req)
        ])

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        next();
    }

    static OrderNew = async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all([
            body('mesero').isString().withMessage('El mesero debe ser caracteres').optional().notEmpty().withMessage('El mesero es requerido').run(req),
            body('products').isArray().withMessage('Los productos debe ser un arreglo').notEmpty().withMessage('Los productos son requeridos').run(req),
            body('table').isNumeric().withMessage('La mesa debe ser un numero').notEmpty().withMessage('La mesa es requerida').run(req)
        ])

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        next();
    }

    static OrderUpdate = async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all([
            body('mesero').optional().isString().withMessage('El mesero debe ser caracteres').run(req),
            body('products').optional().isArray().withMessage('Los productos debe ser un arreglo').run(req),
            body('status').optional().isBoolean().withMessage('El estado debe ser true/false').run(req),
            body('total').optional().isNumeric().withMessage('El total debe ser un numero').run(req)
        ])

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        next();
    }

    static OrderChangeStatus = async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all([
            body('status').isBoolean().withMessage('El estado debe ser true/false').notEmpty().withMessage('El estado es requerido').run(req),
            body('methodPayment').isString().withMessage('El metodo de pago debe ser caracteres').notEmpty().withMessage('El metodo de pago es requerido').run(req),
        ])

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        next();
    }

}