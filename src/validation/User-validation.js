import Joi from "joi";

const registerUserValidation = Joi.object({
    ID: Joi.number().required(),
    NIK: Joi.number().required(),
    name: Joi.string().max(100).required()
});

const loginUserValidation = Joi.object({
    ID: Joi.number().required(),
    NIK: Joi.number().required()
});

const getUserValidation = Joi.string().max(100).required();

const updateUserValidation = Joi.object({
    ID: Joi.number().required(),
    NIK: Joi.number().optional(),
    name: Joi.string().max(100).optional()
})

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation
}
