import { NextFunction, Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client"
import { ErrorHandler } from "errors";
let client = new PrismaClient()


export class UserController {


    // get all
    static async getAllUser(req: Request, res: Response, next: NextFunction) {
        try {

            let usersData: User[] = await client.user.findMany()

            res.status(200).send({
                success: true,
                message: "data users successfully",
                data: usersData
            })
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }



    // create user
    static async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            let { name, user_name, email, password }: Omit<User, "id"> = req.body

            email = String(email)
            let existUser = await client.user.findFirst({
                where: {
                    email: email,
                }
            });

            if (existUser) {
                return res.status(400).send({
                    success: false,
                    message: "Foydalanuvchi allaqachon mavjud"
                });
            }

            let newUser: User = await client.user.create({
                data: {
                    name,
                    user_name,
                    email,
                    password
                }
            });

            res.status(201).send({
                success: true,
                message: "Foydalanuvchi muvaffaqiyatli yaratildi",
                data: newUser
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }




    // updat user
    static async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            let { id, name, user_name, email, password }: Partial<User> = req.body
            let existUser = await client.user.findUnique({
                where: {
                    id: id,
                }
            });

            if (!existUser) {
                return res.status(400).send({
                    success: false,
                    message: "Foydalanuvchi mavjud emas"
                });
            }

            let updatedUser: User = await client.user.update({
                data: {
                    name,
                    user_name,
                    email,
                    password

                }, where: {
                    id
                }
            })

            res.status(201).send({
                success: true,
                message: "Foydalanuvchi muvaffaqiyatli yangilandi",
                data: updatedUser
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }



    // delete user
    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            let { id } = req.params;
            const userId = Number(id);

            if (isNaN(userId)) {
                return res.status(400).send({
                    success: false,
                    message: "Foydalanuvchi ID noto'g'ri"
                });
            }

            let checkUser = await client.user.findUnique({
                where: {
                    id: userId,
                }
            });

            if (!checkUser) {
                return res.status(400).send({
                    success: false,
                    message: "Foydalanuvchi mavjud emas"
                });
            }


            await client.user.delete({
                where: {
                    id: userId,
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