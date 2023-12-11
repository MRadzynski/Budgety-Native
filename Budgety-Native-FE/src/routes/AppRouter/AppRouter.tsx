import * as Linking from 'expo-linking';
import {
  getFromSecureStore,
  saveToSecureStore
} from '../../utils/secureStorage';
import { NavigationContainer } from '@react-navigation/native';
import { setUser } from '../../slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useEffect } from 'react';
import { useUserLocalization } from '../../hooks/useUserLocalization';
import AuthStack from '../AuthStack/AuthStack';
import DrawerNavigator from '../DrawerNavigator/DrawerNavigator';

const prefix = Linking.createURL('/');

const AppRouter: React.FC<any> = () => {
  const currentUser = useAppSelector(state => state.user.currentUser);

  const dispatch = useAppDispatch();

  useUserLocalization();

  useEffect(() => {
    const fetchUserFromSecureStore = async () => {
      const userData = await getFromSecureStore('user');

      if (userData) {
        dispatch(setUser(JSON.parse(userData)));
      }
    };

    fetchUserFromSecureStore();
  }, []);

  useEffect(() => {
    currentUser &&
      'token' in currentUser &&
      saveToSecureStore('user', JSON.stringify(currentUser));
  }, [currentUser]);

  const linking = {
    config: {
      screens: {
        ResetPassword: {
          parse: {
            token: (token: string) => token
          },
          path: 'reset-password/:token'
        }
      }
    },
    prefixes: [prefix]
  };

  return (
    <NavigationContainer linking={linking}>
      {currentUser && 'email' in currentUser && currentUser?.email !== '' ? (
        <DrawerNavigator />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppRouter;
