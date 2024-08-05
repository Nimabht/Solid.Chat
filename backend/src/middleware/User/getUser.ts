import { Request, Response, NextFunction } from "express";
import User from "../../models/userModel";
import AppError from "../../utils/class/AppError";

// Middleware to fetch a user by ID
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
  id: string,
) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      const ex = AppError.notFound("User not found");
      return next(ex);
    }
    req.user = user; // Attach the user to the request object
    next();
  } catch (error: any) {
    const ex = AppError.badRequest("Invalid ID");
    return next(ex);
  }
};
