import { App } from '@/app';
import { PostRoute } from '@routes/posts.route';
import { CommentRoute } from '@routes/comments.route';

const app = new App([new PostRoute(), new CommentRoute()]);

app.listen();
