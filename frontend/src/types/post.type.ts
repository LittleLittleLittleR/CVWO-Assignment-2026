import type { Topic } from "./topic.type";
import type { User } from "./user.type";

export interface Post {
  id: number;
  topic: Topic;
  createdBy: User;
  content: string;
  createdAt: string;
}