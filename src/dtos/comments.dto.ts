import { IsInt, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  public postId: number;

  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  public text: string;
}

export class CommentDto {
  @IsInt()
  public id: number;

  @IsString()
  public text: string;

  @IsInt()
  public postId: number;

  @IsInt()
  public createdBy: number;
}
