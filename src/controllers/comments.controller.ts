import { NextFunction, Response } from 'express';
import { Container } from 'typedi';
import { CommentService } from '@/services/comments.service';
import { Comment } from '@/interfaces/comments.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { HttpException } from '@/exceptions/httpException';
import { PostService } from '@/services/posts.service';
import { validatorDto, validatorArrayDto } from '@/helpers/validation';
import { CommentDto } from '@/dtos/comments.dto';

export class CommentController {
  private checkAccess = async (postId: number, groupIdsFromUser: number[]): Promise<boolean> => {
    const postService = Container.get(PostService);

    const post = await postService.getPostById(postId);
    if (!post) {
      throw new HttpException(404, 'Post not found');
    }
    const postGroupId = post.groupId;

    return groupIdsFromUser.includes(postGroupId);
  };

  public comment = Container.get(CommentService);

  public getCommentsByPostId = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = Number(req.params.postId);
      const hasAccess = await this.checkAccess(postId, req.user.groupIds);
      if (!hasAccess) {
        throw new HttpException(403, 'Forbidden');
      }
      const getCommentsData: CommentDto[] = await this.comment.getCommentsByPostId(postId);

      const errors = await validatorArrayDto(getCommentsData, CommentDto);
      if (errors.length > 0) {
        throw new HttpException(400, `Validation failed. The error fields : ${errors.map(({ property }) => property)}`);
      }
      res.status(200).json({ data: getCommentsData, message: 'getCommentsByPostId' });
    } catch (error) {
      next(error);
    }
  };

  public createComment = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const commentData: Comment = { ...req.body, createdBy: req.user.id };
      const { postId } = commentData;
      const hasAccess = await this.checkAccess(postId, req.user.groupIds);
      if (!hasAccess) {
        throw new HttpException(403, 'Forbidden');
      }
      const createCommentData: CommentDto = await this.comment.createComment(commentData);

      const errors = await validatorDto(createCommentData, CommentDto);
      if (errors.length > 0) {
        throw new HttpException(400, `Validation failed. The error fields : ${errors.map(({ property }) => property)}`);
      }

      res.status(201).json({ data: createCommentData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}
