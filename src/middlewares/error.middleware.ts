import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/httpException';

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction): void => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    const stackTrace: string = error.stack || 'No stack trace';
    console.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message, stackTrace });
  } catch (error) {
    next(error);
  }
};
