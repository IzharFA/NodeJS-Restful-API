import {validate} from "../validation/validation.js";
import {
    getUserValidation,
    loginUserValidation,
    registerUserValidation,
    updateUserValidation
} from "../validation/user-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            ID: user.ID
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, "ID already exists");
    }

    user.NIK = await bcrypt.hash(user.NIK, 12);

    return prismaClient.user.create({
        data: user,
        select: {
            ID: true,
            name: true
        }
    });
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            ID: loginRequest.ID
        },
        select: {
            ID: true,
            NIK: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "ID or NIK wrong");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "ID or NIK wrong");
    }

    const token = uuid().toString()
    return prismaClient.user.update({
        data: {
            token: token
        },
        where: {
            ID: user.ID
        },
        select: {
            token: true
        }
    });
}

const get = async (ID) => {
    ID = validate(getUserValidation, ID);

    const user = await prismaClient.user.findUnique({
        where: {
            ID: ID
        },
        select: {
            ID: true,
            name: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return user;
}

const update = async (request) => {
    const user = validate(updateUserValidation, request);

    const totalUserInDatabase = await prismaClient.user.count({
        where: {
            ID: user.ID
        }
    });

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(404, "user is not found");
    }

    const data = {};
    if (user.name) {
        data.name = user.name;
    }
    if (user.NIK) {
        data.NIK = await bcrypt.hash(user.NIK, 12);
    }

    return prismaClient.user.update({
        where: {
            ID: user.ID
        },
        data: data,
        select: {
            ID: true,
            name: true
        }
    })
}

const logout = async (ID) => {
    ID = validate(getUserValidation, ID);

    const user = await prismaClient.user.findUnique({
        where: {
            ID: ID
        }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return prismaClient.user.update({
        where: {
            ID: ID
        },
        data: {
            token: null
        },
        select: {
            ID: true
        }
    })
}

export default {
    register,
    login,
    get,
    update,
    logout
}
