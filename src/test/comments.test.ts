import { JWT_SECRET_KEY } from '@/config';
import request from 'supertest';
import { App } from '@/app';
import pg from '@database';
import { CommentRoute } from '@/routes/comments.route';
import { CreateCommentDto } from '@/dtos/comments.dto';
import { sign } from 'jsonwebtoken';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  pg.end();
});

describe('Testing Comments', () => {
  describe('[GET] /comments/:postId', () => {
    it('response statusCode 200 / findByPostId', async () => {
      const commentsRoute = new CommentRoute();
      const app = new App([commentsRoute]);
      const token = sign({ id: 1, groupIds: [1] }, JWT_SECRET_KEY, { expiresIn: '1h' });
      const postId = 1;

      return await request(app.getServer()).get(`${commentsRoute.path}/${postId}`).auth(token, { type: 'bearer' }).expect(200);
    });
    it('response statusCode 404 / not found', async () => {
      const commentsRoute = new CommentRoute();
      const app = new App([commentsRoute]);
      const token = sign({ id: 1, groupIds: [1] }, JWT_SECRET_KEY, { expiresIn: '1h' });
      const postId = 101;

      return await request(app.getServer()).get(`${commentsRoute.path}/${postId}`).auth(token, { type: 'bearer' }).expect(404);
    });
    it('response statusCode 401 / unauthorized', async () => {
      const commentsRoute = new CommentRoute();
      const app = new App([commentsRoute]);
      const invalidToken = sign({ id: 1, groupIds: [1] }, 'JWT_SECRET_KEY1', { expiresIn: '1h' });
      const postId = 1;

      return await request(app.getServer()).get(`${commentsRoute.path}/${postId}`).auth(invalidToken, { type: 'bearer' }).expect(401);
    });
  });

  describe('[POST] /comments', () => {
    it('response statusCode 201 / created', async () => {
      const commentData: CreateCommentDto = {
        postId: 1,
        text: 'text',
      };
      const commentsRoute = new CommentRoute();
      const app = new App([commentsRoute]);
      const token = sign({ id: 1, groupIds: [1] }, JWT_SECRET_KEY, { expiresIn: '1h' });

      return await request(app.getServer()).post(`${commentsRoute.path}`).auth(token, { type: 'bearer' }).send(commentData).expect(201);
    });
    it('response statusCode 401 / unauthorized', async () => {
      const commentData: CreateCommentDto = {
        postId: 1,
        text: 'text',
      };
      const commentsRoute = new CommentRoute();
      const app = new App([commentsRoute]);

      return await request(app.getServer()).post(`${commentsRoute.path}`).send(commentData).expect(401);
    });
    it('response statusCode 400 / bad request', async () => {
      const commentData: CreateCommentDto = {
        postId: 1,
        text: '',
      };
      const commentsRoute = new CommentRoute();
      const app = new App([commentsRoute]);
      const token = sign({ id: 1, groupIds: [1] }, JWT_SECRET_KEY, { expiresIn: '1h' });

      return await request(app.getServer()).post(`${commentsRoute.path}`).auth(token, { type: 'bearer' }).send(commentData).expect(400);
    });

    it('response statusCode 404 / Post not found', async () => {
      const commentData: CreateCommentDto = {
        postId: 101,
        text: 'text',
      };
      const commentsRoute = new CommentRoute();
      const app = new App([commentsRoute]);
      const token = sign({ id: 1, groupIds: [1] }, JWT_SECRET_KEY, { expiresIn: '1h' });

      return await request(app.getServer()).post(`${commentsRoute.path}`).auth(token, { type: 'bearer' }).send(commentData).expect(404);
    });
  });
});
