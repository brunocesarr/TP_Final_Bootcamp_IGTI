import { AppBar, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import styles from './styles';

const Header: React.FC = () => {
  return (
    <AppBar elevation={5} position="static" style={{ backgroundColor: '#8a8a8a' }}>
      <Toolbar variant="dense" style={styles.header}>
        <Typography variant="h6" align="center">
          MovInstagram
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
