import { Router } from 'express';
import { CommentController } from '@controllers/comments.controller';
import { CreateCommentDto } from '@/dtos/comments.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class CommentRoute implements Routes {
  public path = '/comments';
  public router = Router();
  public comment = new CommentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:postId(\\d+)`, AuthMiddleware, this.comment.getCommentsByPostId);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateCommentDto), AuthMiddleware, this.comment.createComment);
  }
}
