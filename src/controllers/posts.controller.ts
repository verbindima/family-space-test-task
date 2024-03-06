import { NextFunction, Response } from 'express';
import { Container } from 'typedi';
import { PostService } from '@/services/posts.service';
import { Post } from '@/interfaces/posts.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { HttpException } from '@/exceptions/httpException';
import { validatorDto, validatorArrayDto } from '@/helpers/validation';
import { PostDto } from '@/dtos/posts.dto';

export class PostController {
  private checkAccess = (groupIdFromParams: number, groupIdsFromUser: number[]): boolean => {
    return groupIdsFromUser.includes(groupIdFromParams);
  };
  public post = Container.get(PostService);

  public getPostsByGroupId = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const groupId = Number(req.params.groupId);
      if (!this.checkAccess(groupId, req.user.groupIds)) {
        throw new HttpException(403, 'Forbidden');
      }

      const getPostsData: PostDto[] = await this.post.getPostsByGroupId(groupId);
      const errors = await validatorArrayDto(getPostsData, PostDto);
      if (errors.length > 0) {
        throw new HttpException(400, `Validation failed. The error fields : ${errors.map(({ property }) => property)}`);
      }

      res.status(200).json({ data: getPostsData, message: 'getPostsByGroupId' });
    } catch (error) {
      next(error);
    }
  };

  public createPost = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postData: Post = { ...req.body, createdBy: req.user.id };
      const { groupId } = postData;
      if (!this.checkAccess(groupId, req.user.groupIds)) {
        throw new HttpException(403, 'Forbidden');
      }

      const createPostData: PostDto = await this.post.createPost(postData);
      const errors = await validatorDto(createPostData, PostDto);
      if (errors.length > 0) {
        throw new HttpException(400, `Validation failed. The error fields : ${errors.map(({ property }) => property)}`);
      }

      res.status(201).json({ data: createPostData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}
