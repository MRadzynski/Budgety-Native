import { deleteFromSecureStore } from '../../utils/secureStorage';
import { DrawerActions } from '@react-navigation/native';
import { setUser } from '../../slices/userSlice';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch } from '../../hooks/redux';
import { useTranslation } from 'react-i18next';
import ROUTES from '../../data/routes.json';

interface IRoute {
  name: string;
  route: string;
}

const CustomDrawerContent: React.FC<any> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const handleLogout = async () => {
    dispatch(setUser({}));
    await deleteFromSecureStore('user');
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const navigateToScreen = (route: string) => () => {
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      {ROUTES.map(({ name, route }: IRoute) => (
        <TouchableOpacity
          key={route}
          onPress={navigateToScreen(route)}
          style={styles.menuItem}
        >
          <Text style={styles.menuItemText}>{t(name)}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        key="logout"
        onPress={handleLogout}
        style={styles.menuItemLogout}
      >
        <Text style={styles.menuItemText}>{t('logout')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 20,
    justifyContent: 'center'
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '100%'
  },
  menuItemLogout: {
    paddingHorizontal: 20,
    paddingTop: 50,
    width: '100%'
  },
  menuItemText: {
    fontSize: 18,
    textAlign: 'center'
  }
});

export default CustomDrawerContent;
