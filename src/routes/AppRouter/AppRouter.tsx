import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../../hooks/redux';
import AuthStack from '../AuthStack/AuthStack';
import DrawerNavigator from '../DrawerNavigator/DrawerNavigator';

interface IProps {
  isAuthed: boolean;
}
const AppRouter: React.FC<any> = ({ isAuthed }: IProps) => {
  const currentUser = useAppSelector(state => state.user.currentUser);

  return (
    <NavigationContainer>
      {Boolean(currentUser?.email) ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppRouter;
