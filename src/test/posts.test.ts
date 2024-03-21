import { JWT_SECRET_KEY } from '@/config';
import request from 'supertest';
import { App } from '@/app';
import pg from '@database';
import { PostRoute } from '@/routes/posts.route';
import { CreatePostDto } from '@/dtos/posts.dto';
import { sign } from 'jsonwebtoken';

let authorizationToken: string;

beforeAll(async () => {
  authorizationToken = sign({ id: 1, groupIds: [1] }, JWT_SECRET_KEY, { expiresIn: '1h' });
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  pg.end();
});

describe('Testing Posts', () => {
  describe('[GET] /posts/:groupId', () => {
    it('response statusCode 401 / unauthorized (invalid token)', async () => {
      const postsRoute = new PostRoute();
      const app = new App([postsRoute]);
      const invalidToken = sign({ id: 1, groupIds: [1] }, 'JWT_SECRET_KEY1', { expiresIn: '1h' });
      const groupId = 1;

      return await request(app.getServer()).get(`${postsRoute.path}/${groupId}`).auth(invalidToken, { type: 'bearer' }).expect(401);
    });

    it('response statusCode 200 / findByGroupId', async () => {
      const postsRoute = new PostRoute();
      const app = new App([postsRoute]);
      const groupId = 1;

      return await request(app.getServer()).get(`${postsRoute.path}/${groupId}`).auth(authorizationToken, { type: 'bearer' }).expect(200);
    });
    it('response statusCode 403 / forbidden', async () => {
      const postsRoute = new PostRoute();
      const app = new App([postsRoute]);
      const groupId = 101;

      return await request(app.getServer()).get(`${postsRoute.path}/${groupId}`).auth(authorizationToken, { type: 'bearer' }).expect(403);
    });
  });

  describe('[POST] /posts', () => {
    it('response statusCode 401 / unauthorized (missing token)', async () => {
      const postData: CreatePostDto = {
        groupId: 1,
        text: 'text',
      };
      const postsRoute = new PostRoute();
      const app = new App([postsRoute]);

      return await request(app.getServer()).post(`${postsRoute.path}`).send(postData).expect(401);
    });
    it('response statusCode 201 / created', async () => {
      const postData: CreatePostDto = {
        groupId: 1,
        text: 'text',
      };
      const postsRoute = new PostRoute();
      const app = new App([postsRoute]);

      return await request(app.getServer()).post(`${postsRoute.path}`).auth(authorizationToken, { type: 'bearer' }).send(postData).expect(201);
    });
    it('response statusCode 403 / forbidden', async () => {
      const postData: CreatePostDto = {
        groupId: 101,
        text: 'text',
      };
      const postsRoute = new PostRoute();
      const app = new App([postsRoute]);

      return await request(app.getServer()).post(`${postsRoute.path}`).auth(authorizationToken, { type: 'bearer' }).send(postData).expect(403);
    });
    it('response statusCode 400 / bad request', async () => {
      const postData: CreatePostDto = {
        groupId: 1,
        text: '',
      };
      const postsRoute = new PostRoute();
      const app = new App([postsRoute]);

      return await request(app.getServer()).post(`${postsRoute.path}`).auth(authorizationToken, { type: 'bearer' }).send(postData).expect(400);
    });
  });
});
