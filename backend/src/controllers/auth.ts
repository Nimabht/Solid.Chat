import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import AppError from "../utils/class/AppError";
import { validateUserLogin, validateUserSignup } from "../validators/Auth";

const generateToken = (user: any, secret: string, expiresIn: string) => {
  return jwt.sign({ id: user._id, roles: user.roles }, secret, { expiresIn });
};

class AuthController {
  public async signup(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { error, value } = validateUserSignup(req.body);
      if (error) {
        return next(AppError.badRequest(error.toString()));
      }

      // Check for duplicate username or email
      const duplicateUser = await User.findOne({
        $or: [{ username: value.username }, { email: value.email }],
      });

      if (duplicateUser) {
        if (duplicateUser.username === value.username) {
          return next(AppError.badRequest("Username is already taken"));
        }
        if (duplicateUser.email === value.email.toLocaleLowerCase()) {
          return next(AppError.badRequest("Email is already taken"));
        }
      }

      const newUser = new User(value);
      await newUser.save();

      const token = generateToken(
        newUser,
        process.env.JWT_SECRET as string,
        "1h",
      );
      const refreshToken = generateToken(
        newUser,
        process.env.JWT_REFRESH_SECRET as string,
        "7d",
      );

      res.status(201).json({ token, refreshToken });
    } catch (error: any) {
      next(AppError.internal("Error during signup"));
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { error, value } = validateUserLogin(req.body);

    if (error) {
      return next(AppError.badRequest(error.toString()));
    }

    const { username, email, password } = value;

    // Find the user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email }],
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(AppError.badRequest("Invalid username or password"));
    }

    const token = generateToken(
      user,
      process.env.JWT_SECRET as string,
      process.env.JWT_EXPIRATION as string | "1h",
    );
    const refreshToken = generateToken(
      user,
      process.env.JWT_REFRESH_SECRET as string,
      process.env.JWT_REFRESH_EXPIRATION as string | "7d",
    );

    res.status(200).json({ token, refreshToken });
  }

  public async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(AppError.badRequest("Refresh token is required"));
    }

    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      ) as any;
      const user = await User.findById(payload.id);
      if (!user) {
        return next(AppError.notFound("User not found"));
      }

      const token = generateToken(user, process.env.JWT_SECRET as string, "1h");
      res.status(200).json({ token });
    } catch (error) {
      next(AppError.unAuthorized("Invalid refresh token"));
    }
  }
}

export default new AuthController();
