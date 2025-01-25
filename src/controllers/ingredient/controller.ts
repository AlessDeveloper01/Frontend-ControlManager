import { RequestHandler, Request, Response } from "express";
import { CustomError } from "../../middlewares";
import Ingredient from "../../models/Ingredient.entity";
import { Op } from "sequelize";

export class IngredientController {
    static create: RequestHandler = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { dataValues } = req.body.user;

            if (dataValues.permission !== "Administrador") {
                throw CustomError.forbidden(
                    "No tienes permisos para realizar esta acción"
                );
            }

            const ingredient = new Ingredient();
            ingredient.name = req.body.name;
            ingredient.quantity = +req.body.quantity;
            await ingredient.save();

            res.status(201).json({ msg: "Ingrediente creado correctamente" });
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    errors: [{ msg: error.message }],
                });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({
                    errors: [{ msg: internalError.message }],
                });
            }
        }
    };

    static list: RequestHandler = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { status, page, namesearch } = req.query;

            const optionsQuery: any = {
                where: {},
                include: [],
            };

            if (status && status === "active") {
                optionsQuery.where.status = true;
            }

            if (page && parseInt(page as string) > 0) {
                const limit = 5;
                const offset = (parseInt(page as string) - 1) * limit;
                optionsQuery.limit = limit;
                optionsQuery.offset = offset;
            }

            let totalIngredients = await Ingredient.count();
            let totalPages = Math.ceil(totalIngredients / 5);

            if (namesearch && namesearch !== "") {
                optionsQuery.where.name = {
                    [Op.iLike]: `%${namesearch}%`,
                };
            }

            const ingredients = await Ingredient.findAll(optionsQuery);
            res.status(200).json({ ingredients, totalPages });
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    errors: [{ msg: error.message }],
                });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({
                    errors: [{ msg: internalError.message }],
                });
            }
        }
    };

    static listById: RequestHandler = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const ingredient = await Ingredient.findByPk(id);

            if (!ingredient) {
                throw CustomError.notFound("Ingrediente no encontrado");
            }

            res.status(200).json({ ingredient });
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    errors: [{ msg: error.message }],
                });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({
                    errors: [{ msg: internalError.message }],
                });
            }
        }
    };

    static update: RequestHandler = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { dataValues } = req.body.user;

            if (dataValues.permission !== "Administrador") {
                throw CustomError.forbidden(
                    "No tienes permisos para realizar esta acción"
                );
            }

            const { id } = req.params;
            const ingredient = await Ingredient.findByPk(id);

            if (!ingredient) {
                throw CustomError.notFound("Ingrediente no encontrado");
            }

            if (req.body.quantity && req.body.quantity < 0) {
                throw CustomError.badRequest("La cantidad no puede ser menor a 0");
            }

            await ingredient.update(req.body);

            res.status(200).json({ msg: "Ingrediente actualizado correctamente" });
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    errors: [{ msg: error.message }],
                });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({
                    errors: [{ msg: internalError.message }],
                });
            }
        }
    };
    static delete: RequestHandler = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { dataValues } = req.body.user;

            if (dataValues.permission !== "Administrador") {
                throw CustomError.forbidden(
                    "No tienes permisos para realizar esta acción"
                );
            }

            const { id } = req.params;
            const ingredient = await Ingredient.findByPk(id);

            if (!ingredient) {
                throw CustomError.notFound("Ingrediente no encontrado");
            }

            await ingredient.update({ status: false });

            res.status(200).json({ msg: "Ingrediente eliminado correctamente" });
        } catch (error) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    errors: [{ msg: error.message }],
                });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({
                    errors: [{ msg: internalError.message }],
                });
            }
        }
    };
}
