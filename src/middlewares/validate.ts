import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { errorResponse } from "@/utils/response";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      errorResponse(res, "Validation Error", 400, errorMessages);
      return;
    }

    next();
  };
};
