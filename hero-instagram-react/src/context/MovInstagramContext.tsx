/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from 'models/User';
import { createContext, useEffect, useState } from 'react';
import * as apiMovInstagram from 'services/apiMovInstagram';

export const MovInstagramContext = createContext({
  userActive: {
    urlPhoto: '',
    name: '',
    numPosts: 0,
    numLikes: 0,
    numComments: 0,
  },
  setUserActive: (user: User) => {},
  bestFriends: [],
  handleToggleUserActived: (nameHero: string) => {},
});

const MovInstagramProvider: React.FC = ({ children }) => {
  const [userActive, setUserActive] = useState<User>({
    name: '',
    numComments: 0,
    numLikes: 0,
    numPosts: 0,
    urlPhoto: '',
  });
  const [bestFriends, setBestFriends] = useState<User[]>([]);

  useEffect(() => {
    const getBestFriends = async (): Promise<void> => {
      const response = await apiMovInstagram.getBestFriends();
      const userSuperman = response.find((user) => user.name === 'superman');

      setBestFriends(response);
      setUserActive(userSuperman);
    };

    try {
      getBestFriends();
    } catch (error) {
      console.error('Error: ', error);
    }
  }, [bestFriends]);

  const handleToggleUserActived = (nameUser: string): void => {
    const userActive = bestFriends.find((user) => user.name === nameUser);
    setUserActive(userActive);
  };

  return (
    <MovInstagramContext.Provider
      value={{
        userActive,
        setUserActive,
        bestFriends,
        handleToggleUserActived,
      }}
    >
      {children}
    </MovInstagramContext.Provider>
  );
};

export default MovInstagramProvider;
