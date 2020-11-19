import {
  Avatar,
  capitalize,
  Card,
  CardContent,
  CardMedia,
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { MovInstagramContext } from 'context/MovInstagramContext';
import { User } from 'models/User';
import React, { useContext } from 'react';

import styles from './style.module.css';

type InfoPerfilProps = {
  users: User[];
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  })
);

const InfoPerfil: React.FC<InfoPerfilProps> = ({ users }: InfoPerfilProps) => {
  const { userActive, handleToggleUserActived } = useContext(MovInstagramContext);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper elevation={2} style={{ margin: '10px', flexGrow: 1 }}>
        <Grid container direction="row">
          <Grid item xs={6} container direction="row" alignItems="center">
            <Grid item container xs={6} justify="flex-end">
              <Avatar
                alt={userActive.name}
                src={userActive.urlPhoto}
                className={styles.photoPerfil}
                style={{
                  height: 120,
                  width: 120,
                }}
              />
            </Grid>
            <Grid item container direction="column" xs={6}>
              <Typography variant="body1">{capitalize(userActive.name)}</Typography>
              <Typography variant="body2" color="textSecondary">
                {userActive.numComments || 'No'} Comments
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {userActive.numLikes || 'No'} Likes
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {userActive.numPosts || 'No'} Posts
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={6} container direction="column" alignItems="center">
            <p
              style={{
                fontWeight: 'bold',
                fontSize: '1.2em',
                textAlign: 'center',
              }}
            >
              Visualizar Timeline com:
            </p>
            <Grid container direction="row">
              {users.map((user, index) => (
                <Card
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: '0 5px',
                    backgroundColor: userActive.name === user.name ? '#e5e5e5' : 'white',
                  }}
                  className={styles.btnPerfil}
                  elevation={3}
                  onClick={() => handleToggleUserActived(user.name)}
                >
                  <CardMedia style={{ padding: '0 10px' }}>
                    <Avatar
                      alt={user.name}
                      src={user.urlPhoto}
                      style={{
                        height: 50,
                        width: 50,
                      }}
                    />
                  </CardMedia>
                  <Divider orientation="vertical" />
                  <CardContent>
                    <Typography variant="subtitle1" color="textSecondary">
                      {capitalize(user.name)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default InfoPerfil;
