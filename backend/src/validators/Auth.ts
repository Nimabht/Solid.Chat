import Joi from "joi";

export const validateUserLogin = (body: any) => {
  const schema = Joi.object({
    username: Joi.string()
      .trim()
      .lowercase()
      .when("email", {
        is: Joi.exist(),
        then: Joi.forbidden(),
        otherwise: Joi.required(),
      })
      .messages({
        "string.base": `"username" should be a string`,
        "any.required": `"username" is required if "email" is not provided`,
        "any.forbidden": `"username" cannot be present if "email" is provided`,
      }),
    email: Joi.string().email().lowercase().trim().messages({
      "string.base": `"email" should be a string`,
      "string.email": `"email" must be a valid email address`,
      "any.required": `"email" is required if "username" is not provided`,
      "any.forbidden": `"email" cannot be present if "username" is provided`,
    }),
    password: Joi.string().min(8).required().messages({
      "string.base": `"password" should be a string`,
      "string.min": `"password" should have a minimum length of {#limit}`,
      "any.required": `"password" is required`,
    }),
  })
    .required()
    .xor("username", "email")
    // Ensure the entire object is required
    .messages({
      "object.xor": `"username" and "email" cannot be present at the same time. One of them is required.`,
      "object.base": `"body" should be an object`,
      "any.required": `"body" cannot be empty, must contain username/email and password`,
    });

  return schema.validate(body);
};

export const validateUserSignup = (body: any) => {
  const schema = Joi.object({
    username: Joi.string().required().trim().lowercase().messages({
      "string.base": `"username" should be a string`,
      "any.required": `"username" is required`,
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
    roles: Joi.forbidden().default(["user"]).messages({
      "any.unknown": `"roles" field is not allowed`,
    }),
  });

  return schema.validate(body);
};
