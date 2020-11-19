import { User } from './User';

export interface Post {
  id: string;
  urlPhoto: string;
  author: User;
  title: string;
  numLikes: number;
  likes: Like[];
  liked: boolean;
  comments: Comment[];
}

export interface Comment {
  id: string;
  descricao: string;
  author: User;
}

export interface Like {
  id: string;
  author: User;
}
