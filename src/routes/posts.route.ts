import { Router } from 'express';
import { PostController } from '@controllers/posts.controller';
import { CreatePostDto } from '@dtos/posts.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class PostRoute implements Routes {
  public path = '/posts';
  public router = Router();
  public post = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:groupId(\\d+)`, AuthMiddleware, this.post.getPostsByGroupId);
    this.router.post(`${this.path}`, ValidationMiddleware(CreatePostDto), AuthMiddleware, this.post.createPost);
  }
}
