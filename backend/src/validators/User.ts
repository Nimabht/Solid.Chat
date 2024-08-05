import Joi from "joi";

export const validatePagination = (query: any) => {
  const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    per_page: Joi.number().integer().min(10).max(100).default(10),
  });

  return paginationSchema.validate(query);
};

export const validateUserUpdate = (body: any) => {
  const schema = Joi.object({
    username: Joi.string().optional(),
    nickname: Joi.string().optional(),
    email: Joi.string().email().optional(),
    name: Joi.string().optional(),
    roles: Joi.array().items(Joi.string().valid("Admin", "user")).optional(),
  });

  return schema.validate(body);
};
