import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { Image, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Link } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveToSecureStore } from '../../utils/secureStorage';
import { setUser } from '../../slices/userSlice';
import { useAppDispatch } from '../../hooks/redux';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withErrorBoundary } from '../../hoc/withErrorBoundary';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import Title from '../../components/Title/Title';
import Toast from 'react-native-toast-message';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();

  const abortControllerRef = useRef<AbortController>(new AbortController());

  const { t } = useTranslation();

  const getTranslatedServerErrorMessages = (message: string) => {
    switch (message) {
      case 'All fields must be filled':
        return t('toastErrorAllFieldsMustBeFilled');
      case 'Incorrect email':
        return t('toastErrorInvalidEmail');
      case 'Incorrect email or password':
        return t('toastErrorWrongEmailOrPassword');
      default:
        return t('toastErrorSomethingWentWrong');
    }
  };

  const handleEmailChange = (e: string) => setEmail(e);

  const handlePasswordChange = (e: string) => setPassword(e);

  const handleSubmit = async () => {
    const url = `${API_URL}/api/user/login`;
    const body = {
      email: email.trim().toLowerCase(),
      password: password.trim()
    };

    try {
      const response = await fetch(url, {
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        signal: abortControllerRef.current?.signal
      });

      const data = await response.json();

      if (response.ok && data?.user) {
        const { currency, email, language, username } = data.user;

        dispatch(
          setUser({ currency, email, language, token: data?.token, username })
        );

        await saveToSecureStore(
          'user',
          JSON.stringify({
            currency,
            email,
            language,
            token: data?.token,
            username
          })
        );
      } else {
        Toast.show({
          props: {
            text1FontSize: 16,
            text2FontSize: 11
          },
          text1: getTranslatedServerErrorMessages(data?.error),
          text2: t('toastErrorWrongCredentials'),
          type: 'error'
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Toast.show({
          text1: getTranslatedServerErrorMessages(error.message),
          type: 'error'
        });
      } else {
        Toast.show({
          text1: t('toastErrorSomethingWentWrong'),
          type: 'error'
        });
      }
    }
  };

  const isSubmitBtnDisabled =
    email.trim().length === 0 || password.trim().length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.keyboardContentContainer}
        enableOnAndroid={true}
        extraScrollHeight={70}
      >
        <Title
          customStyles={{
            container: styles.titleContainer,
            content: styles.titleContent
          }}
          text="Budgety"
        />
        <Image
          resizeMode="contain"
          source={require('../../../assets/logo.png')}
          style={styles.image}
        />

        <View style={styles.inputContainer}>
          <CustomTextInput
            autoCapitalize="none"
            onChangeText={handleEmailChange}
            placeholderText={t('email')}
            type="email-address"
          />
          <CustomTextInput
            autoCapitalize="none"
            hashText
            onChangeText={handlePasswordChange}
            placeholderText={t('password')}
            type="default"
            value={password}
          />
          <Link
            style={styles.forgotPasswordText}
            to={{ screen: 'ForgotPassword' }}
          >
            {t('forgotPassword')}
          </Link>
        </View>
        <CustomButton
          customStyles={{
            container: styles.buttonContainer
          }}
          isDisabled={isSubmitBtnDisabled}
          onPress={handleSubmit}
          title={t('signIn')}
        />
        <View style={styles.paragraphContainer}>
          <Text style={styles.paragraph}>
            {t('doNotHaveAccount')}{' '}
            <Link style={styles.link} to={{ screen: 'SignUp' }}>
              {t('signUp')}!
            </Link>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    marginTop: 20,
    width: 240
  },
  container: {
    backgroundColor: COLORS.PRIMARY,
    flex: 1
  },
  forgotPasswordText: {
    alignSelf: 'flex-end',
    color: COLORS.SECONDARY,
    marginTop: -12,
    textAlign: 'right',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid'
  },
  image: {
    alignItems: 'center',
    height: 220,
    justifyContent: 'center',
    width: '100%'
  },
  input: {
    borderColor: '#888888',
    borderWidth: 1,
    fontSize: 16,
    marginLeft: 80,
    marginRight: 80,
    padding: 5
  },
  inputContainer: {
    alignSelf: 'center',
    gap: 10,
    height: 120,
    width: '60%'
  },
  keyboardContentContainer: {
    backgroundColor: COLORS.PRIMARY,
    flex: 1,
    gap: 40
  },
  link: {
    color: COLORS.SECONDARY,
    fontSize: 16,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid'
  },
  paragraph: {
    color: COLORS.WHITE_SHADE
  },
  paragraphContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '7%',
    textAlign: 'center'
  },
  titleContainer: {
    backgroundColor: 'transparent',
    marginTop: 30
  },
  titleContent: {
    fontSize: 48,
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { height: 3, width: 3 },
    textShadowRadius: 6
  }
});

export default withErrorBoundary(LoginScreen);
