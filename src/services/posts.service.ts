import { Service } from 'typedi';
import pg from '@database';
import { Post } from '@interfaces/posts.interface';
import { PostDto } from '@/dtos/posts.dto';

@Service()
export class PostService {
  public async getPostsByGroupId(groupId: number): Promise<PostDto[]> {
    const { rows } = await pg.query(
      `
      SELECT
        p.id,
        p.text,
        p.group_id as "groupId",
        p.created_by as "createdBy",
        COALESCE(c.comments_count, 0)::int as "commentsCount"
      FROM
        posts p
      LEFT JOIN (
        SELECT post_id, COUNT(*) as comments_count
        FROM comments
        GROUP BY post_id
      ) c ON p.id = c.post_id
      WHERE
        p.group_id = $1
      `,
      [groupId],
    );
    return rows;
  }

  public async getPostById(postId: number): Promise<Post> {
    const { rows } = await pg.query(
      `
    SELECT
      p.id,
      p.text,
      p.group_id as "groupId",
      p.created_by as "createdBy",
      COALESCE(c.comments_count, 0)::int as "commentsCount"
    FROM
      posts p
    LEFT JOIN (
      SELECT post_id, COUNT(*) as comments_count
      FROM comments
      GROUP BY post_id
    ) c ON p.id = c.post_id
    WHERE
      p.id = $1
    `,
      [postId],
    );
    return rows[0];
  }

  public async createPost(postData: Post): Promise<PostDto> {
    const { text, groupId, createdBy } = postData;

    const { rows: createPostData } = await pg.query(
      `
      INSERT INTO
        posts(
          "text",
          group_id,
          created_by
        )
      VALUES ($1, $2, $3)
      RETURNING
        "id",
        "text",
        group_id as "groupId",
        created_by as "createdBy"
      `,
      [text, groupId, createdBy],
    );

    return { ...createPostData[0], commentsCount: 0 };
  }
}
