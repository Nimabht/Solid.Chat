import { JwtPayload } from "jsonwebtoken";
import { IClient } from "../interfaces/clientInt";
import { IAvailableTime } from "./../interface/Request";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
