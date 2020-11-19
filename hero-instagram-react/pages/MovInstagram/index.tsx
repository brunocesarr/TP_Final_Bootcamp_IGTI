import { CircularProgress, Divider, Grid, Paper, Typography } from '@material-ui/core';
import { ErrorRounded } from '@material-ui/icons';
import InfoPerfil from 'components/InfoPerfil';
import PostInstagram from 'components/Post';
import { MovInstagramContext } from 'context/MovInstagramContext';
import { Post } from 'models/Post';
import { NextPage } from 'next';
import React, { useContext, useEffect, useState } from 'react';
import * as apiMovInstagram from 'services/apiMovInstagram';

const MovInstagram: NextPage = () => {
  const { userActive, bestFriends } = useContext(MovInstagramContext);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
  const [errorloadingPosts, setErrorLoadingPosts] = useState<string>('');

  useEffect(() => {
    setLoadingPosts(true);
    const getPosts = async (): Promise<void> => {
      let response = await apiMovInstagram.getAllPost();

      response = await apiMovInstagram.getPostsByUser(response, userActive.name);

      setPosts(response);
      setLoadingPosts(false);
    };

    try {
      if (userActive.name !== '') getPosts();
    } catch (error) {
      console.error('Error: ', error);
      setErrorLoadingPosts(error.message);
      setLoadingPosts(false);
    }
  }, [userActive.name]);

  const handleOnChangePosts = (postAltered: Post): void => {
    const newPosts = posts.filter((post) => post.id !== postAltered.id);
    newPosts.push(postAltered);
    console.log(newPosts);
    setPosts(newPosts);
  };

  return (
    <div>
      {bestFriends.length > 0 && userActive.name !== '' && (
        <>
          <InfoPerfil users={bestFriends} />
          {loadingPosts && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '20px',
              }}
            >
              <CircularProgress />
              <p>Searching Posts...</p>
            </div>
          )}
          {!loadingPosts && errorloadingPosts !== '' && (
            <Grid item container xs={12} alignItems="center" direction="column">
              <ErrorRounded color="error"></ErrorRounded>
              <Typography color="textSecondary" align="center">
                Error ao buscar os posts! Detalhes: {errorloadingPosts}
              </Typography>
            </Grid>
          )}
          {!loadingPosts && errorloadingPosts === '' && (
            <Grid item container xs={12} direction="column">
              <Paper elevation={2} style={{ padding: '10px 0', margin: '0 10px' }}>
                <Typography variant="h5" align="center">
                  <Divider />
                  Timeline
                  <Divider />
                </Typography>
              </Paper>
              {posts.map((post, index) => (
                <PostInstagram
                  key={index}
                  post={post}
                  handleOnChangePosts={(postAltered: Post) => handleOnChangePosts(postAltered)}
                />
              ))}
            </Grid>
          )}
        </>
      )}
    </div>
  );
};

export default MovInstagram;
