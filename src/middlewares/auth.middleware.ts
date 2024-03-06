import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { JWTTokenPayload, RequestWithUser } from '@interfaces/auth.interface';

const getAuthorizationToken = (req: RequestWithUser): string | null => {
  const cookie = req.cookies['Authorization'];
  if (cookie) return cookie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authorizationToken = getAuthorizationToken(req);

    if (authorizationToken) {
      const payload = verify(authorizationToken, JWT_SECRET_KEY) as JWTTokenPayload;
      req.user = payload;
      next();
    } else {
      next(new HttpException(401, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};
