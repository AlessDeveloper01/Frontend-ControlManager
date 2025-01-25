import { RequestHandler, Request, Response } from "express";
import { CustomError } from "../../middlewares";
import Product from "../../models/Product.entity";
import ProductIngredient from "../../models/ProductIngredient.entity";
import Category from "../../models/Category.entity";
import Ingredient from "../../models/Ingredient.entity";
import { Op } from "sequelize";

export class ProductController {

    static create: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { dataValues } = req.body.user;

            if(dataValues.permission !== 'Administrador') {
                throw CustomError.forbidden('No tienes permisos para realizar esta accion');
            }

            const { name, price, categoryId, ingredients } = req.body;

            if(price <= 0) {
                throw CustomError.badRequest('El precio debe ser mayor a 0');
            }

            if(ingredients.length === 0) {
                throw CustomError.badRequest('El producto debe tener al menos un ingrediente');
            }

            const product = new Product();
            
            const category = await Category.findOne({ where: { id: categoryId } });
            
            if(!category) {
                throw CustomError.badRequest('La categoria no existe');
            }

            product.name = name;
            product.price = price;
            product.category = category;
            product.categoryId = category.id;
            
            await product.save();
            
            for(const ingredient of ingredients) {
                const ingredientEntity = await Ingredient.findOne({ where: { id: ingredient.id } });
                
                if(!ingredientEntity) {
                    throw CustomError.badRequest('El ingrediente no existe');
                }
                
                try {
                    const productIngredient = new ProductIngredient();
                    productIngredient.ingredientId = ingredient.id;
                    productIngredient.productId = product.id;
                    await productIngredient.save();
                } catch (error) {
                    console.log(error);
                    throw CustomError.badRequest('Ocurrio un error al guardar los ingredientes');
                }
            }


            res.status(201).json({ msg: 'Producto creado exitosamente' });
        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [ { message: error.message } ] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [ { message: internalError.message } ] });
            }
        }
    }

    static list: RequestHandler = async (req: Request, res: Response) => {
        try {
            const optionsQuery: any = {
                where: {},
                include: ['category', 'ingredients'],
            }

            const { status, page, name } = req.query;

            if (status && status === "active") {
                optionsQuery.where.status = true;
            }

            if(page && parseInt(page as string) > 0) {
                const limit = 5;
                const offset = (parseInt(page as string) - 1) * limit;
                optionsQuery.limit = limit;
                optionsQuery.offset = offset;
            }

            let totalProducts = await Product.count();
            let totalPages = Math.ceil(totalProducts / 5);

            if (name && name !== "") {
                optionsQuery.where.name = {
                    [Op.iLike]: `%${name}%`,
                };
            }

            const products = await Product.findAll(optionsQuery);
            res.status(200).json({ products, totalPages });
        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [ { message: error.message } ] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [ { message: internalError.message } ] });
            }
        }
    }

    static get: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const product = await Product.findOne({ where: { id }, include: ['category', 'ingredients'] });

            if(!product) {
                throw CustomError.notFound('Producto no encontrado');
            } 

            res.status(200).json({ product });
        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [ { message: error.message } ] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [ { message: internalError.message } ] });
            }
        }
    }

    static delete: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { dataValues } = req.body.user;

            if(dataValues.permission !== 'Administrador') {
                throw CustomError.forbidden('No tienes permisos para realizar esta accion');
            }

            const { id } = req.params;

            const product = await Product.findOne({ where: { id } });

            if(!product) {
                throw CustomError.notFound('Producto no encontrado');
            }

            const productIngredients = await ProductIngredient.findAll({ where: { productId: product.id } });

            for(const productIngredient of productIngredients) {
                await productIngredient.destroy();
            }

            await product.destroy();

            res.status(200).json({ msg: 'Producto eliminado exitosamente' });
        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [ { message: error.message } ] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [ { message: internalError.message } ] });
            }
        }
    }

    static update: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { dataValues } = req.body.user;

            if(dataValues.permission !== 'Administrador') {
                throw CustomError.forbidden('No tienes permisos para realizar esta accion');
            }

            const { id } = req.params;
            const { name, price, categoryId, ingredients, active } = req.body;

            const product = await Product.findOne({ where: { id } });

            if(!product) {
                throw CustomError.notFound('Producto no encontrado');
            }

            const category = await Category.findOne({ where: { id: categoryId } });

            if(!category) {
                throw CustomError.badRequest('La categoria no existe');
            }

            product.name = name;
            product.price = price;
            product.category = category;
            product.categoryId = category.id;
            product.status = active;
            
            await product.save();

            const productIngredients = await ProductIngredient.findAll({ where: { productId: product.id } });

            for(const productIngredient of productIngredients) {
                await productIngredient.destroy();
            }

            for(const ingredient of ingredients) {
                const ingredientEntity = await Ingredient.findOne({ where: { id: ingredient.id } });
                
                if(!ingredientEntity) {
                    throw CustomError.badRequest('El ingrediente no existe');
                }
                
                try {
                    const productIngredient = new ProductIngredient();
                    productIngredient.ingredientId = ingredient.id;
                    productIngredient.productId = product.id;
                    await productIngredient.save();
                } catch (error) {
                    console.log(error);
                    throw CustomError.badRequest('Ocurrio un error al guardar los ingredientes');
                }
            }

            res.status(200).json({ msg: 'Producto actualizado exitosamente' });
        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [ { message: error.message } ] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [ { message: internalError.message } ] });
            }
        }
    }

    static getByName: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { name } = req.params;

            const product = await Product.findOne({ where: { 
                name: {
                    [Op.iLike]: `%${name}%`,
                }
            }, include: ['category', 'ingredients'] });

            if(!product) {
                throw CustomError.notFound('Producto no encontrado');
            } 

            res.status(200).json({ product });
        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [ { message: error.message } ] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [ { message: internalError.message } ] });
            }
        }
    }
}