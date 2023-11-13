import { NextFunction, Request, Response } from 'express';

export const logger = (req: Request, _res: Response, next: NextFunction) => {
  console.log(`Request path: ${req.path}`);
  console.log(`Request method: ${req.method}`);
  next();
};
