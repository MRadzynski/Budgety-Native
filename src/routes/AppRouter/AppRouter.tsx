import { NavigationContainer } from '@react-navigation/native';
import AuthStack from '../AuthStack/AuthStack';
import DrawerNavigator from '../DrawerNavigator/DrawerNavigator';

interface IProps {
  isAuthed: boolean;
}
const AppRouter: React.FC<any> = ({ isAuthed }: IProps) => {
  return (
    <NavigationContainer>
      {isAuthed ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppRouter;
