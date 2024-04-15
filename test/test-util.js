import {prismaClient} from "../src/app/database.js";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            id_user:9699
        }
    })
}

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            ID: 9699,
            NIK: await bcrypt.hash(Izanami, 10),
            name: "test",
            token: "test"
        }
    })
}

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            id_user:ID 
        }
    });
}

