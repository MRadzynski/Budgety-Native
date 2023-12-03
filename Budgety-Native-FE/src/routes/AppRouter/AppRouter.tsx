import {
  getFromSecureStore,
  saveToSecureStore
} from '../../utils/secureStorage';
import { NavigationContainer } from '@react-navigation/native';
import { setUser } from '../../slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useEffect } from 'react';
import AuthStack from '../AuthStack/AuthStack';
import DrawerNavigator from '../DrawerNavigator/DrawerNavigator';

const AppRouter: React.FC<any> = () => {
  const currentUser = useAppSelector(state => state.user.currentUser);

  const dispatch = useAppDispatch();

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

  return (
    <NavigationContainer>
      {currentUser && 'email' in currentUser && currentUser?.email !== '' ? (
        <DrawerNavigator />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppRouter;
