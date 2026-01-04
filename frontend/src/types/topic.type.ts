import type { User } from "./user.type";

export interface Topic {
  id: number;
  createdBy: User;
  title: string;
  createdAt: string;
}