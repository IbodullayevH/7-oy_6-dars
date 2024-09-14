import { PrismaClient, Products } from '@prisma/client';
import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "errors";
let client = new PrismaClient()


export class ProductController {


    // get all
    static async getAllProducts(req: Request, res: Response, next: NextFunction) {
        try {

            let productsData: Products[] = await client.products.findMany()

            res.status(200).send({
                success: true,
                message: "data products successfully",
                data: productsData
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }



    // create user
    static async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            let { name, price, desc }: Omit<Products, "id"> = req.body

            name = String(name)
            let existProduct = await client.products.findFirst({
                where: {
                    name: name,
                }
            });

            if (existProduct) {
                return res.status(400).send({
                    success: false,
                    message: "Mahsulot allaqachon mavjud"
                });
            }

            let newProduct: Products = await client.products.create({
                data: {
                    name, price, desc
                }
            });

            res.status(201).send({
                success: true,
                message: "Mahsulot muvaffaqiyatli yaratildi",
                data: newProduct
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }




    // updat user
    static async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            let {id, name, price, desc }: Partial<Products> = req.body

            let existProduct = await client.products.findUnique({
                where: {
                    id: id,
                }
            });

            if (!existProduct) {
                return res.status(400).send({
                    success: false,
                    message: "Mahsulot mavjud emas"
                });
            }

            let updateProduct: Products = await client.products.update({
                data: {
                    name, price, desc
                },
                where: {
                    id
                }
            });

            res.status(201).send({
                success: true,
                message: "Mahsulot muvaffaqiyatli yaratildi",
                data: updateProduct
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }



    // delete user
    static async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            let { id } = req.params;
            const productId = Number(id);

            if (isNaN(productId)) {
                return res.status(400).send({
                    success: false,
                    message: "Mahsulot ID noto'g'ri"
                });
            }

            let checkProduct = await client.products.findUnique({
                where: {
                    id: productId,
                }
            });

            if (!checkProduct) {
                return res.status(400).send({
                    success: false,
                    message: "Mahsulot mavjud emas"
                });
            }


            await client.products.delete({
                where: {
                    id: productId,
                }
            });

            res.status(200).send({
                success: true,
                message: "Foydalanuvchi muvaffaqiyatli o'chirildi"
            });

        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }
}