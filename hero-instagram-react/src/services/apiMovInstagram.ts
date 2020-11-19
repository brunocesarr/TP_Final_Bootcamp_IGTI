import { Post, Comment, Like } from 'models/Post';
import { User } from 'models/User';

import { instance } from './apiBase';

let users: User[] = [];
let bestFriends: User[] = [];
let posts: Post[] = [];

const getBestFriends = async (): Promise<User[]> => {
  if (bestFriends.length > 0) {
    return bestFriends;
  }
  users = await getUsers();

  const { data } = await instance.get('bestFriends');

  bestFriends = users.filter((user) => data.includes(user.name));

  return bestFriends;
};

const getUsers = async (): Promise<User[]> => {
  if (users.length > 0) {
    return users;
  }

  const { data } = await instance.get('users');

  users = await Promise.all(
    data.map(async (user: string) => {
      return {
        name: user,
        urlPhoto: `/assets/${user}.png`,
        numPosts: await getTotalPostByUser(user),
        numLikes: await getTotalLikesByUser(user),
        numComments: await getTotalCommentsByUser(user),
      };
    })
  );

  return users;
};

const getTotalPostByUser = async (author: string): Promise<number> => {
  const { data } = await instance.get(`posts?user=${author}`);
  return parseInt(data.length);
};

const getTotalCommentsByUser = async (author: string): Promise<number> => {
  const { data } = await instance.get(`comments?user=${author}`);
  return parseInt(data.length);
};

const getTotalLikesByUser = async (author: string): Promise<number> => {
  const { data } = await instance.get(`likes?user=${author}`);
  return parseInt(data.length);
};

const getAllPost = async (): Promise<Post[]> => {
  if (posts.length > 0) {
    return posts;
  }

  const { data } = await instance.get('posts');

  posts = await Promise.all(
    data.map(async (post: any) => {
      return {
        id: post.id,
        urlPhoto: post.picture,
        author: users.find((user) => user.name === post.user),
        title: post.title,
        numLikes: (await getTotalLikesPost(post.id)).length,
        likes: await getTotalLikesPost(post.id),
        liked: false,
        comments: await getCommentsByPost(post.id),
      };
    })
  );

  return posts;
};

const getTotalLikesPost = async (idPost: string): Promise<string[]> => {
  const { data } = await instance.get(`likes?postId=${idPost}`);

  const usersLiked = data.map((like) => {
    return {
      id: like.id,
      author: users.find((user) => user.name === like.user),
    };
  });

  return usersLiked;
};

const getCommentsByPost = async (idPost: string): Promise<Comment[]> => {
  const { data } = await instance.get(`comments?postId=${idPost}`);

  const comments: Comment[] = await Promise.all(
    data.map(async (comment) => ({
      id: comment.id,
      descricao: comment.comment,
      author: users.find((user) => user.name === comment.user),
    }))
  );
  return comments;
};

const getSituationLikedPost = async (idPost: string, author: string): Promise<boolean> => {
  const { data } = await instance.get(`likes?postId=${idPost}&user=${author}`);
  return parseInt(data.length) > 0;
};

const addLikeInPost = async (like: Like, postId: string): Promise<void> => {
  const newLike = {
    id: like.id,
    user: like.author.name,
    postId,
  };

  await instance.post(`likes`, newLike);
};

const removeLikeInPost = async (id: string): Promise<void> => {
  await instance.delete(`likes/${id}`);
};

const getPostsByUser = async (posts: Post[], author: string): Promise<Post[]> => {
  return await Promise.all(
    posts.map(async (post) => {
      return {
        ...post,
        liked: await getSituationLikedPost(post.id, author),
      };
    })
  );
};

export {
  getBestFriends,
  getAllPost,
  getSituationLikedPost,
  getPostsByUser,
  addLikeInPost,
  removeLikeInPost,
};
