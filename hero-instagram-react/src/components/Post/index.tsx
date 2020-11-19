import {
  Avatar,
  capitalize,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Comment, Favorite, FavoriteBorder } from '@material-ui/icons';
import { MovInstagramContext } from 'context/MovInstagramContext';
import { Like, Post } from 'models/Post';
import React, { useContext, useState } from 'react';
import * as apiMovInstagram from 'services/apiMovInstagram';
import { v4 as uuidv4 } from 'uuid';

type PostProps = {
  post: Post;
  handleOnChangePosts;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      margin: '0 auto',
      marginBottom: '5px',
    },
  })
);

const PostInstagram: React.FC<PostProps> = ({ post, handleOnChangePosts }: PostProps) => {
  const classes = useStyles();
  const [postUser, setPostUser] = useState<Post>(post);
  const [liked, setLiked] = useState<boolean>(post.liked || false);
  const { userActive, setUserActive } = useContext(MovInstagramContext);

  const handleToggleLike = (): void => {
    let likes = postUser.likes;
    if (!liked === true) {
      const likeAdded: Like = { id: uuidv4(), author: userActive };
      likes.push(likeAdded);

      apiMovInstagram.addLikeInPost(likeAdded, postUser.id);
      setUserActive({ numLikes: userActive.numLikes++, ...userActive });
    } else {
      const idLikeRemoved: string = likes.find((like) => like.author.name === userActive.name).id;
      likes = likes.filter((like) => like.author.name !== userActive.name);

      apiMovInstagram.removeLikeInPost(idLikeRemoved);
      setUserActive({ numLikes: userActive.numLikes--, ...userActive });
    }

    const postAltered = {
      ...postUser,
      liked: !postUser.liked,
      likes,
      numLikes: likes.length,
    };

    setLiked(!liked);
    setPostUser(postAltered);
    handleOnChangePosts(postAltered);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={3} style={{ margin: '10px' }}>
        <Grid container direction="row" spacing={2}>
          <Grid item container xs={5}>
            <img src={postUser.urlPhoto} alt={postUser.urlPhoto} />
          </Grid>
          <Grid item container xs={7} direction="column">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Avatar
                alt={postUser.author.name}
                src={postUser.author.urlPhoto}
                style={{
                  height: 50,
                  width: 50,
                }}
              />
              <Typography
                variant="subtitle1"
                color="textPrimary"
                style={{ margin: '0 20px 0 5px' }}
              >
                {capitalize(postUser.author.name)}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {postUser.title}
              </Typography>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                padding: '50px, 0',
              }}
            >
              <Tooltip title={postUser.likes.map((post) => post.author.name).join(', ')} arrow>
                <p>
                  <IconButton onClick={handleToggleLike}>
                    {postUser.liked ? (
                      <Favorite style={{ color: 'cornflowerblue' }} />
                    ) : (
                      <FavoriteBorder style={{ color: 'gray' }} />
                    )}
                  </IconButton>
                  {postUser.numLikes}
                </p>
              </Tooltip>
              <p>
                <IconButton disabled={true}>
                  <Comment style={{ color: 'gray' }} />
                </IconButton>
                {postUser.comments.length}
              </p>
            </div>
            <div className={classes.root}>
              {postUser.comments.map((comment, index: number) => (
                <Paper key={`comment-${index}`} className={classes.paper} elevation={3}>
                  <Grid container spacing={2}>
                    <Grid item container xs={4} direction="row">
                      <Grid item xs>
                        <Avatar
                          alt={comment.author?.name}
                          src={comment.author?.urlPhoto}
                          style={{
                            height: 30,
                            width: 30,
                          }}
                        />
                      </Grid>
                      <Grid item xs={9}>
                        <Typography variant="body2" gutterBottom>
                          {capitalize(comment.author?.name || '')}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={7} sm container>
                      <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                          <Typography variant="body2" gutterBottom>
                            {comment.descricao}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </div>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default PostInstagram;
