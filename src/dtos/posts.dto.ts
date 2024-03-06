import { IsInt, IsString, MinLength, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsInt()
  public groupId: number;

  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  public text: string;
}

export class PostDto {
  @IsInt()
  public id: number;

  @IsString()
  public text: string;

  @IsInt()
  public createdBy: number;

  @IsInt()
  public commentsCount: number;
}
