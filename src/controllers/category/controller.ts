import { RequestHandler, Request, Response } from "express";
import { CustomError } from "../../middlewares";
import Category from "../../models/Category.entity";
import { Op } from "sequelize";
import Product from "../../models/Product.entity";

export class CategoryController {
    static create: RequestHandler = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const category = new Category(req.body);
            await category.save();

            res.status(201).json(category);
        } catch (error) {
            const internalError = CustomError.internalServer();
            res.status(internalError.statusCode).json({
                errors: [{ message: internalError.message }],
            });
        }
    };

    static getAll: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { status, products, page, nameproduct } = req.query;

            const optionsQuery: any = {
                where: {},
                include: [],
            };

            if (status && status === "active") {
                optionsQuery.where.active = true;
            }

            if (products && products === "include") {
                optionsQuery.include.push("products");
            }

            if (page && parseInt(page as string) > 0) {
                const limit = 5;
                const offset = (parseInt(page as string) - 1) * limit;
                optionsQuery.limit = limit;
                optionsQuery.offset = offset;
            }

            let totalCategories = await Category.count();
            let totalPages = Math.ceil(totalCategories / 5);

            if (nameproduct && nameproduct !== "") {
                optionsQuery.where.name = {
                    [Op.iLike]: `%${nameproduct}%`,
                };
            }

            const categories = await Category.findAll(optionsQuery);
            res.status(200).json({ categories, totalPages });
        } catch (error) {
            console.log(error);
            const internalError = CustomError.internalServer();
            res.status(internalError.statusCode).json({
                errors: [{ message: internalError.message }],
            });
        }
    };

    static getById: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const category = await Category.findOne({
                where: { id },
                include: ["products"],
            });

            if (!category) {
                throw CustomError.notFound("Categoria no encontrada");
            }

            res.status(200).json(category);
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    errors: [{ message: error.message }],
                });
                return;
            }
            const internalError = CustomError.internalServer();
            res.status(internalError.statusCode).json({
                errors: [{ message: internalError.message }],
            });
        }
    };

    static delete: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { dataValues } = req.body.user;

            if (dataValues.permission !== "Administrador") {
                throw CustomError.forbidden(
                    "No tienes permisos para realizar esta acción"
                );
            }

            const { id } = req.params;

            const category = await Category.findOne({ where: { id } });

            if (!category) {
                throw CustomError.notFound("Categoria no encontrada");
            }

            if(!category.active) {
                throw CustomError.badRequest('La categoría ya se encuentra desactivada');
            }

            category.active = false;
            await category.save();

            res.status(200).json(category);
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    errors: [{ message: error.message }],
                });
                return;
            }
            const internalError = CustomError.internalServer();
            res.status(internalError.statusCode).json({
                errors: [{ message: internalError.message }],
            });
        }
    };

    static update: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { dataValues } = req.body.user;

            if (dataValues.permission !== "Administrador") {
                throw CustomError.forbidden(
                    "No tienes permisos para realizar esta acción"
                );
            }

            const { id } = req.params;

            const category = await Category.findOne({ where: { id } });

            if (!category) {
                throw CustomError.notFound("Categoria no encontrada");
            }

            category.update(req.body);
            await category.save();

            res.status(200).json(category);
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    errors: [{ message: error.message }],
                });
                return;
            }
            const internalError = CustomError.internalServer();
            res.status(internalError.statusCode).json({
                errors: [{ message: internalError.message }],
            });
        }
    };

    static search: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { name } = req.query;
            
            if (!name) {
                throw CustomError.badRequest('El nombre es requerido');
            }

            const categories = await Category.findAll({
                where: {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                }
            });

            res.status(200).json(categories);
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    errors: [{ message: error.message }],
                });
                return;
            }
            const internalError = CustomError.internalServer();
            res.status(internalError.statusCode).json({
                errors: [{ message: internalError.message }],
            });
        }
    }

    static getByName: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { name } = req.params;

            const category = await Category.findOne({
                where: { 
                    name: {
                        [Op.iLike]: name
                    },
                    active: true
                 },
                include: ["products"],
            });

            if (!category) {
                throw CustomError.notFound('Categoria no encontrada');
            }

            res.status(200).json(category);
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    errors: [{ message: error.message }],
                });
                return;
            }
            const internalError = CustomError.internalServer();
            res.status(internalError.statusCode).json({
                errors: [{ message: internalError.message }],
            });
        }
    }

    static getProductsByName: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { name } = req.params;

            const products = await Product.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${name}%`
                    }
                }
            });

            res.status(200).json(products);
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    errors: [{ message: error.message }],
                });
                return;
            }
            const internalError = CustomError.internalServer();
            res.status(internalError.statusCode).json({
                errors: [{ message: internalError.message }],
            });
        }
    }
}
