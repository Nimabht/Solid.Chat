import Joi from "joi";

export const validatePagination = (query: any) => {
  const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      "number.base": `"page" should be a number`,
      "number.integer": `"page" should be an integer`,
      "number.min": `"page" should be at least {#limit}`,
    }),
    per_page: Joi.number().integer().min(10).max(100).default(10).messages({
      "number.base": `"per_page" should be a number`,
      "number.integer": `"per_page" should be an integer`,
      "number.min": `"per_page" should be at least {#limit}`,
      "number.max": `"per_page" should be less than or equal to {#limit}`,
    }),
  });

  return paginationSchema.validate(query);
};

export const validateUserUpdate = (body: any) => {
  const schema = Joi.object({
    username: Joi.string()
      .optional()
      .trim()
      .lowercase()
      .min(3)
      .max(50)
      .messages({
        "string.base": `"username" should be a string`,
        "string.min": `"username" should have a minimum length of {#limit}`,
        "string.max": `"username" should have a maximum length of {#limit}`,
      }),
    nickname: Joi.string().optional().messages({
      "string.base": `"nickname" should be a string`,
    }),
    email: Joi.string().email().trim().lowercase().optional().messages({
      "string.base": `"email" should be a string`,
      "string.email": `"email" must be a valid email address`,
    }),
    name: Joi.string().optional().messages({
      "string.base": `"name" should be a string`,
    }),
    roles: Joi.array()
      .items(Joi.string().valid("Admin", "user"))
      .optional()
      .messages({
        "array.base": `"roles" should be an array`,
        "string.base": `"roles" should contain valid strings`,
        "any.only": `"roles" can only contain "Admin" or "user"`,
      }),
  });

  return schema.validate(body);
};

export const validateUserCreation = (body: any) => {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .trim()
      .lowercase()
      .min(3)
      .max(50)
      .messages({
        "string.base": `"username" should be a string`,
        "any.required": `"username" is required`,
        "string.min": `"username" should have a minimum length of {#limit}`,
        "string.max": `"username" should have a maximum length of {#limit}`,
      }),
    nickname: Joi.string().optional().messages({
      "string.base": `"nickname" should be a string`,
    }),
    email: Joi.string().email().trim().lowercase().required().messages({
      "string.base": `"email" should be a string`,
      "string.email": `"email" must be a valid email address`,
      "any.required": `"email" is required`,
    }),
    name: Joi.string().required().messages({
      "string.base": `"name" should be a string`,
      "any.required": `"name" is required`,
    }),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$"))
      .min(8)
      .required()
      .messages({
        "string.pattern.base": `"password" must contain both letters and numbers`,
        "string.min": `"password" should have a minimum length of {#limit}`,
        "any.required": `"password" is required`,
      }),
    roles: Joi.array()
      .items(Joi.string().valid("Admin", "user"))
      .default(["user"])
      .messages({
        "array.base": `"roles" should be an array`,
        "string.base": `"roles" should contain valid strings`,
        "any.only": `"roles" can only contain "Admin" or "user"`,
      }),
  });

  return schema.validate(body);
};
