import Header from 'components/Header';
import MovInstagramProvider from 'context/MovInstagramContext';
import { User } from 'models/User';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import * as apiMovInstagram from 'services/apiMovInstagram';

import MovInstagram from './MovInstagram';

type Props = {
  launch: {
    mission: string;
    site: string;
    timestamp: number;
    rocket: string;
  };
};

const IndexPage: NextPage<Props> = () => {
  const [bestFriends, setBestFriends] = useState<User[]>([]);

  useEffect(() => {
    const getBestFriends = async (): Promise<void> => {
      const response = await apiMovInstagram.getBestFriends();
      setBestFriends(response);
    };

    try {
      getBestFriends();
    } catch (error) {
      console.error('Error: ', error);
    }
  }, [bestFriends]);

  return (
    <main>
      <Header />
      <MovInstagramProvider>
        <MovInstagram />
      </MovInstagramProvider>
    </main>
  );
};
export default IndexPage;
