import type { Post } from "./post.type";
import type { User } from "./user.type";

export interface Comment {
  id: number;
  post: Post;
  parentComment?: Comment;
  createdBy: User;
  content: string;
  createdAt: string;
}