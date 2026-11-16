import Joi from 'joi';

export const createTodoSchema = Joi.object({
    title: Joi.string().trim().max(200).required(),
    completed: Joi.boolean().default(false),
});

export const updateTodoSchema = Joi.object({
    title: Joi.string().trim().max(200),
    completed: Joi.boolean(),
}).min(1);
