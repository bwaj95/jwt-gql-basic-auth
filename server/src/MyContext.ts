import { Request, Response } from "express";

export interface MyContext {
  req: Request;
  res: Response;
  payload?: {
    userId: number;
    userEmail: string;
    tokenVersion: number;
    validCodes: [string];
  };
}
