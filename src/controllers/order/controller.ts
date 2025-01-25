import { RequestHandler, Request, Response } from "express";
import { CustomError } from "../../middlewares";
import Order from "../../models/Order.entity";
import Product from "../../models/Product.entity";
import OrderProduct from "../../models/OrderProduct.entity";
import Ingredient from "../../models/Ingredient.entity";

export class OrderController {

    static create: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { dataValues } = req.body.user;

            const { products } = req.body;
            let total = 0;
            let errors: string[] = [];

            const order = new Order();
            order.mesero = dataValues.name;
            order.date = new Date();

            for(const product of products) {
                const productDB = await Product.findOne({ where: { id: product.id } });
                if(!productDB) {
                    errors.push(`El producto con id ${product.id} no existe`);
                    continue;  
                }

                total += productDB.price * product.quantity;
            }
            
            order.total = total;
            await order.save();
            
            for(const product of products) {
                const productDB = await Product.findOne({ where: { id: product.id } });
                if(!productDB) {
                    continue;  
                }

                const orderProduct = new OrderProduct();
                orderProduct.productId = productDB.id;
                orderProduct.quantity = product.quantity;
                orderProduct.orderId = order.id;
                orderProduct.price = productDB.price;
                orderProduct.total = productDB.price * product.quantity;
                await orderProduct.save();
            }

            res.status(201).json({ message: 'Orden creada correctamente' });
        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [{ message: error.message }] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [{ message: internalError.message }] });
            }
        }
    }

    static all: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { status, page = 1 } = req.query;

            const options: any = {
                where: {},
                include: ['products'],
                order: [['date', 'DESC']]
            };

            if(status && status === 'completed') {
                options.where.status = true;
            }

            if(status && status === 'pending') {
                options.where.status = false;
            }

            const orders = await Order.findAll(options);
            res.status(200).json({ orders });
        } catch (error) {
            console.log(error);
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [{ message: error.message }] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [{ message: internalError.message }] });
            }
        }
    }

    static get: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const order = await Order.findOne({ where: { id }, include: ['products'] });

            if(!order) {
                throw CustomError.notFound('La orden no existe');
            }

            res.status(200).json({ order });
        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [{ message: error.message }] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [{ message: internalError.message }] });
            }
        }
    }

    static update: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const { status, products } = req.body;

            const order = await Order.findOne({ where: { id }, include: ['products'] });

            if(!order) {
                throw CustomError.notFound('La orden no existe');
            }

            if(status !== undefined && status !== null) {
                order.status = status;
            }

            if(products && products.length > 0) {
                let total = 0;
                for(const product of products) {
                    const productDB = await Product.findOne({ where: { id: product.id } });
                    if(!productDB) {
                        continue;
                    }

                    total += productDB.price * product.quantity;
                }

                order.total = total;

                await OrderProduct.destroy({ where: { orderId: order.id } });

                for(const product of products) {
                    const productDB = await Product.findOne({ where: { id: product.id } });
                    if(!productDB) {
                        continue;
                    }

                    const orderProduct = new OrderProduct();
                    orderProduct.productId = productDB.id;
                    orderProduct.quantity = product.quantity;
                    orderProduct.orderId = order.id;
                    orderProduct.price = productDB.price;
                    orderProduct.total = productDB.price * product.quantity;
                    await orderProduct.save();
                }
            }

            await order.save();

            res.status(200).json({ message: 'Orden actualizada correctamente' });
        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [{ message: error.message }] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [{ message: internalError.message }] });
            }
        }
    }

    static delete: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {

            const { dataValues } = req.body.user;

            if(dataValues.permission !== 'Administrador') {
                throw CustomError.forbidden('No tienes permisos para realizar esta acción');
            }

            const { id } = req.params;

            const order = await Order.findOne({ where: { id } });

            if(!order) {
                throw CustomError.notFound('La orden no existe');
            }

            await OrderProduct.destroy({ where: { orderId: order.id } });
            await order.destroy();

            res.status(200).json({ message: 'Orden eliminada correctamente' });
        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [{ message: error.message }] });
            } else {
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [{ message: internalError.message }] });
            }
        }
    }

    static changeStatus: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const { status, methodPayment } = req.body;

            const order = await Order.findOne({ where: { id } });

            if(!order) {
                throw CustomError.notFound('La orden no existe');
            }

            order.status = status;
            order.methodPayment = methodPayment;
            order.finishDate = new Date();
            await order.save();

            res.status(200).json({ message: 'Estado de la orden actualizado correctamente' });
        } catch (error) {
            if(error instanceof CustomError) {
                res.status(error.statusCode).json({ errors: [{ message: error.message }] });
            } else {
                console.log(error);
                const internalError = CustomError.internalServer();
                res.status(internalError.statusCode).json({ errors: [{ message: internalError.message }] });
            }
        }
    }

} 