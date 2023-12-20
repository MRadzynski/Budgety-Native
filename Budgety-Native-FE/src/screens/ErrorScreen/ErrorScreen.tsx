import { COLORS } from '../../styles/Colors';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NavigationProp, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../components/CustomButton/CustomButton';

const AUTH_NAMES = ['Login', 'SignUp', 'ForgotPassword', 'ResetPassword'];

interface IProps {
  navigation: NavigationProp<any>;
}

const ErrorScreen = ({ navigation }: IProps) => {
  const { name } = useRoute();
  const { t } = useTranslation();

  const navigateToHome = () => {
    AUTH_NAMES.includes(name)
      ? navigation.navigate('Login')
      : navigation.navigate('Home');
  };

  const buttonText = AUTH_NAMES.includes(name) ? t('goStart') : t('goHome');

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/bankrupt.png')} />
      <Text style={styles.errorText}>
        {`${t('toastErrorSomethingWentWrong')}!`}
      </Text>
      <CustomButton
        customStyles={{ textContent: styles.buttonContent }}
        onPress={navigateToHome}
        title={buttonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContent: {
    paddingHorizontal: 10
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    flex: 1,
    gap: 50,
    justifyContent: 'center'
  },
  errorText: {
    color: COLORS.WHITE_SHADE,
    fontSize: 28,
    textAlign: 'center'
  }
});

export default ErrorScreen;
