import { Document } from "mongoose";

// Define the interface for a User document
export interface IUser extends Document {
  username: string;
  nickname?: string;
  email: string;
  name?: string;
  lastLogin?: Date;
  roles: string[];
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
