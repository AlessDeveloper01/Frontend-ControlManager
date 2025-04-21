import { RequestHandler, Response, Request } from "express";
import { CustomError } from "../../middlewares";
import Order from "../../models/Order.entity";
import Box from "../../models/Box.entity";
import OrderProduct from "../../models/OrderProduct.entity";
import BoxProduct from "../../models/BoxProduct.entity";
import Ingredient from "../../models/Ingredient.entity";
import Product from "../../models/Product.entity";
import TableE from "../../models/TableE.entity";

export class BoxController {

    static create: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { dataValues } = req.body.user;

            if(dataValues.permission !== 'Administrador') {
                throw CustomError.forbidden('No tienes permisos para realizar esta acción');
            }

            const orders = await Order.findAll({ include: ['products'] });

            if(orders.length === 0) {
                throw CustomError.badRequest('No hay ordenes para cerrar');
            }

            const total = orders.reduce((acc, order) => acc + (order.total), 0);

            const box = new Box();
            box.name = dataValues.name;
            box.total = total;
            box.date = new Date();
            await box.save();

            const ordersProduct = await OrderProduct.findAll();

            for(const orderP of ordersProduct) {
                const productExists = await Product.findOne({ where: { id: orderP.productId } });

                if (productExists) {
                    const product = await BoxProduct.findOne({ 
                        where: { boxId: box.id, productId: orderP.productId }
                    });

                    if(product) {
                        await product.update({
                            quantity: product.dataValues.quantity + orderP.quantity,
                            total: product.dataValues.total + orderP.total
                        })
                    } else {
                        const newProduct = new BoxProduct({
                            boxId: box.id,
                            productId: orderP.productId,
                            quantity: orderP.quantity,
                            price: orderP.price,
                            total: orderP.total
                        });
                        await newProduct.save();
                    }
                } else {
                    console.log(`Product with id ${orderP.productId} does not exist.`);
                }
            }

            for(const order of orders) {
                for(const productDB of order.products) {
                    const product = await Product.findOne({ where: { id: productDB.id }, include: ['ingredients'] });
                    for(const ingredient of product.ingredients) {
                        const quantity = ingredient.dataValues.ProductIngredient.dataValues.quantity * productDB.dataValues.OrderProduct.dataValues.quantity;
                        const ingredientDB = await Ingredient.findOne({ where: { id: ingredient.id } });
                        await ingredientDB.update({
                            quantity: ingredientDB.quantity - quantity
                        });
                    }
                }
            }

            const tables = TableE.findAll();
            for(const table of await tables) {
                const tableDB = await TableE.findOne({ where: { id: table.id } });
                await tableDB.update({
                    status: false
                });
            }
            await OrderProduct.destroy({ where: {} });
            await Order.destroy({ where: {} });

            res.status(201).json({ message: 'Caja cerrada con exito' });
        } catch (error) {  
            console.log(error);
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

    static list: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const optionsQuery: any = {
                include: ['related_products'],
                order: [['createdAt', 'DESC']],
            };

            const { page } = req.query;

            if(page && parseInt(page as string) > 0) {
                optionsQuery.limit = 10;
                optionsQuery.offset = (parseInt(page as string) - 1) * 10;
            }
            const totalPages = await Box.count();
            const pages = Math.ceil(totalPages / 10);

            const boxes = await Box.findAll(optionsQuery);

            res.status(200).json({ boxes, pages });
        } catch (error) {
            console.log(error);
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

    static listById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const box = await Box.findOne({ where: { id }, include: ['related_products'] });

            if(!box) {
                throw CustomError.notFound('Caja no encontrada');
            }

            res.status(200).json({ box });
        } catch (error) {
            console.log(error);
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

    static delete: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { dataValues } = req.body.user;

            if(dataValues.permission !== 'Administrador') {
                throw CustomError.forbidden('No tienes permisos para realizar esta acción');
            }

            const { id } = req.params;

            const box = await Box.findOne({ where: { id } });

            if(!box) {
                throw CustomError.notFound('Caja no encontrada');
            }

            await BoxProduct.destroy({ where: { boxId: id } });
            await box.destroy();

            res.status(200).json({ message: 'Caja eliminada con exito' });
        } catch (error) {
            console.log(error);
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