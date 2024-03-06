import { Service } from 'typedi';
import pg from '@database';
import { Comment } from '@interfaces/comments.interface';
import { CommentDto } from '@/dtos/comments.dto';

@Service()
export class CommentService {
  public async getCommentsByPostId(postId: number): Promise<CommentDto[]> {
    const { rows } = await pg.query(
      `
    SELECT
      id,
      text,
      post_id as "postId",
      created_by as "createdBy"
    FROM
      comments
    WHERE
      post_id = $1
    
    `,
      [postId],
    );
    return rows;
  }

  public async createComment(commentData: Comment): Promise<CommentDto> {
    const { text, postId, createdBy } = commentData;

    const { rows: createCommentData } = await pg.query(
      `
      INSERT INTO
        comments(
          "text",
          post_id,
          created_by
        )
      VALUES ($1, $2, $3)
      RETURNING id, "text", post_id as "postId", created_by as "createdBy"
      `,
      [text, postId, createdBy],
    );

    return createCommentData[0];
  }
}
