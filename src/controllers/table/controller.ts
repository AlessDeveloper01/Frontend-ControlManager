import * as QRCode from "qrcode";
import { Request, Response, RequestHandler } from "express";
import { envs } from "../../config";
import { CustomError } from "../../middlewares";
import TableE from "../../models/TableE.entity";
import { Op } from "sequelize";
import Order from "../../models/Order.entity";

export class TableController {
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const { dataValues } = req.body.user;

            if (dataValues.permission !== "Administrador") {
                const customBadError = CustomError.forbidden(
                    "No tienes permiso para crear una mesa"
                );
                res.status(customBadError.statusCode).json({
                    errors: [{ msg: customBadError.message }],
                });
                return;
            }

            const { numTable, capacity } = req.body;
            if (!numTable || !capacity) {
                const customBadError = CustomError.badRequest("Faltan datos requeridos");
                res.status(customBadError.statusCode).json({
                    errors: [{ msg: customBadError.message }],
                });
                return;
            }

            if (isNaN(numTable) || isNaN(capacity)) {
                const customBadError = CustomError.badRequest("El número de mesa y la capacidad deben ser números");
                res.status(customBadError.statusCode).json({
                    errors: [{ msg: customBadError.message }],
                });
                return;
            }

            const existingTable = await TableE.findOne({
                where: {
                    numTable,
                },
            });

            if (existingTable) {
                const customBadError = CustomError.badRequest("Ya existe una mesa con el mismo número");
                res.status(customBadError.statusCode).json({
                    errors: [{ msg: customBadError.message }],
                });
                return;
            }

            const baseUrl = envs.URL_FRONTEND || "http://localhost:4000";
            const tableUrl = `${baseUrl}/table/${numTable}`;

            const newTable = await TableE.create({
                numTable,
                capacity,
                status: false,
                image: "/img/tables/default.png",
                qrCode: tableUrl,
            });

            if (!newTable) {
                throw CustomError.badRequest("Error al crear la mesa - #342");
            }

            const qrCode = await QRCode.toDataURL(tableUrl);
            if (!qrCode) {
                throw CustomError.badRequest("Error al generar el código QR");
            }

            res.setHeader("Content-Type", "text/html");
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
            res.send(`
            <html>
            <head>
                <title>QR Code for Table ${numTable}</title>
                <style>
                    body {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        background-color: #f0f0f0;
                        font-family: Arial, sans-serif;
                    }
                    .qr-container {
                        width: 200px;
                        height: 200px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .qr-image {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        max-width: 200px;
                        max-height: 200px;
                    }
                    .qr-text {
                        text-align: center;
                        font-size: 20px;
                        color: #000;
                        font-weight: bold;
                        margin-top: 20px;
                    }
                    .instruction {
                        text-align: center;
                        margin-top: 10px;
                        color: #555;
                    }
                </style>
            </head>
            <body>
                <div class="qr-container">
                    <img class="qr-image" src="${qrCode}" alt="QR Code" />
                </div>
                <h4 class="qr-text">¡¡Escaneame!!</h4>
                <p class="instruction">Este código QR redirigirá a: ${tableUrl}</p>
                <p class="instruction">Mesa #${numTable} - Capacidad: ${capacity}</p>
            </body>
            </html>
        `);
        } catch (error) {
            console.error("Error al crear la mesa:", error);
            res.status(500).json({
                msg: "Error al crear la mesa",
                error: error.message,
            });
        }
    }

    static async list(req: Request, res: Response): Promise<void> {
        try {
            const tables = await TableE.findAll({
                order: [["numTable", "ASC"]],
            });
            if (!tables) {
                res.status(404).send("No se encontraron mesas");
                return;
            }

            res.status(200).json(tables);
        } catch (error) {
            console.error("Error al listar las mesas:", error);
            res.status(500).send("Error al listar las mesas");
        }
    }

    static async listById(req: Request, res: Response): Promise<void> {
        try {
            const tableId = parseInt(req.params.id);
            if (isNaN(tableId)) {
                res.status(400).send("ID de mesa inválido");
                return;
            }

            const table = await TableE.findOne({
                where: { numTable: tableId },
            });

            if (!table) {
                res.status(404).send("Mesa no encontrada");
                return;
            }

            res.status(200).json(table);
        } catch (error) {
            console.error("Error al listar la mesa por ID:", error);
            res.status(500).send("Error al listar la mesa por ID");
        }
    }

    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const tableId = parseInt(req.params.id);
            if (isNaN(tableId)) {
                const badRequestError = CustomError.badRequest("ID de mesa inválido");
                res.status(badRequestError.statusCode).json({
                    errors: [{ msg: badRequestError.message }],
                });
                return;
            }

            const table = await TableE.findOne({
                where: { id: tableId },
            });

            if (!table) {
                const notFoundError = CustomError.notFound("Mesa no encontrada");
                res.status(notFoundError.statusCode).json({
                    errors: [{ msg: notFoundError.message }],
                });
                return;
            }

            // Verificar que no haya órdenes asociadas a la mesa
            const orders = await Order.findAll({
                where: { numTable: table.numTable },
            });

            if (orders.length > 0) {
                const badRequestError = CustomError.badRequest("No se puede eliminar la mesa, hay órdenes asociadas");
                res.status(badRequestError.statusCode).json({
                    errors: [{ msg: badRequestError.message }],
                });
                return;
            }

            // Eliminar la mesa
            await TableE.destroy({
                where: { id: tableId },
            });

            res.status(200).json({
                msg: "Mesa eliminada"
            });
        } catch (error) {
            console.error("Error al eliminar la mesa:", error);
            res.status(500).send("Error al eliminar la mesa");
        }
    }

    static async update(req: Request, res: Response): Promise<void> {
        try {
            const tableId = parseInt(req.params.id);
            if (isNaN(tableId)) {
                res.status(400).send("ID de mesa inválido");
                return;
            }

            const { numTable, capacity } = req.body;
            if (!numTable || !capacity) {
                res.status(400).send("Faltan datos requeridos");
                return;
            }

            if (isNaN(numTable) || isNaN(capacity)) {
                res.status(400).send("El número de mesa y la capacidad deben ser números");

                return;
            }

            const existingTable = await TableE.findOne({
                where: {
                    [Op.and]: [{ numTable }, { id: { [Op.ne]: tableId } }],
                },
            });

            if (existingTable) {
                res.status(400).json({
                    msg: "Ya existe una mesa con el mismo número y capacidad",
                });
                return;
            }

            const table = await TableE.findOne({
                where: { id: tableId },
            });

            if (!table) {
                res.status(404).json({
                    msg: "Mesa no encontrada",
                });
                return;
            }

            // Verificar que no haya órdenes asociadas a la mesa
            const orders = await Order.findAll({
                where: { numTable: table.numTable },
            });

            if (orders.length > 0) {
                res.status(400).json({
                    msg: "No se puede actualizar la mesa, hay órdenes asociadas",
                });
                return;
            }

            // Actualizar la mesa
            await TableE.update({
                numTable,
                capacity
            }, {
                where: { id: tableId },
            });

            res.status(200).json({
                msg: "Mesa actualizada",
            });
        } catch (error) {
            console.error("Error al actualizar la mesa:", error);
            res.status(500).send("Error al actualizar la mesa");
        }
    }

    static async getQrCode(req: Request, res: Response): Promise<void> {
        try {
            const tableId = parseInt(req.params.id);
            const table = await TableE.findOne({
                where: { numTable: tableId },
            });

            if (!table) {
                res.status(404).send("Mesa no encontrada");
                return;
            }

            const qrCode = table.qrCode;
            if (!qrCode) {
                res.status(404).send("Código QR no encontrado");
                return;
            }

           const qrCodeDataUrl = await QRCode.toDataURL(qrCode);

           const base64Data = qrCodeDataUrl.replace("data:image/png;base64,", "");
           const imageBuffer = Buffer.from(base64Data, "base64");

           res.setHeader("Content-Type", "image/png");
           res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
           res.setHeader("Pragma", "no-cache");
           res.setHeader("Expires", "0");
           res.send(imageBuffer);
        } catch (error) {
            console.error("Error al obtener el código QR:", error);
            res.status(500).send("Error al obtener el código QR");
        }
    }
}
