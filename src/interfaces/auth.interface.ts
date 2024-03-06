import { Request } from 'express';

export interface JWTTokenPayload {
  id: number;
  groupIds?: number[];
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: JWTTokenPayload;
}
