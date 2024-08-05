import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import { validatePagination, validateUserUpdate } from "../validators/User";
import AppError from "../utils/class/AppError";

class UserController {
  public async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { error, value } = validatePagination(req.query);
    if (!!error) {
      const ex = AppError.badRequest(error.toString());
      return next(ex);
    }

    const { page, per_page } = value;
    const skip = (page - 1) * per_page;
    const limit = per_page;

    const users = await User.find().skip(skip).limit(limit).lean();
    const totalUsers = await User.countDocuments();
    res.status(200).json({
      page,
      per_page,
      total: totalUsers,
      total_pages: Math.ceil(totalUsers / per_page),
      data: users,
    });
  }

  public async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    res.status(200).json(req.user);
  }

  public async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await User.deleteOne({ _id: req.user._id });
    res.status(200).json({ message: "User deleted successfully" });
  }

  public async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { error, value } = validateUserUpdate(req.body);
    if (error) {
      return next(AppError.badRequest(error.toString()));
    }

    const id = req.user._id;

    // Check for duplicate username and email in a single query
    const duplicateUser = await User.findOne({
      _id: { $ne: id },
      $or: [{ username: value.username }, { email: value.email }],
    });

    if (duplicateUser) {
      if (duplicateUser.username === value.username) {
        return next(AppError.badRequest("Username is already taken"));
      }
      if (duplicateUser.email === value.email) {
        return next(AppError.badRequest("Email is already taken"));
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, value, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedUser) {
      return next(AppError.internal("Somthing went wrong when updating user"));
    }

    res.status(200).json(updatedUser);
  }
}

export default new UserController();
