import * as Localization from 'expo-localization';
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
import { withErrorBoundary } from '../../utils/withErrorBoundary';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import Title from '../../components/Title/Title';
import Toast from 'react-native-toast-message';

const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.trim().toLowerCase());
};

const SignUpScreen = () => {
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const dispatch = useAppDispatch();

  const abortControllerRef = useRef<AbortController>(new AbortController());

  const { i18n, t } = useTranslation();

  const getTranslatedServerErrorMessages = (message: string) => {
    switch (message) {
      case 'Email and password are required':
        return t('toastErrorEmailPasswordRequired');
      case 'Email is not valid':
        return t('toastErrorInvalidEmail');
      case 'Password is not strong enough':
        return t('toastErrorInvalidPasswordWeak');
      case 'User already exists':
        return t('toastErrorInvalidUserAlreadyExists');
      default:
        return t('toastErrorSomethingWentWrong');
    }
  };

  const handleConfirmationPasswordChange = (e: string) =>
    setConfirmationPassword(e);

  const handleEmailChange = (e: string) => setEmail(e);

  const handlePasswordChange = (e: string) => setPassword(e);

  const handleSubmit = async () => {
    if (validateData()) {
      const url = `${API_URL}/api/user/signup`;
      const body = {
        currency: Localization.getLocales()?.[0]?.currencyCode || 'USD',
        email: email.trim().toLowerCase(),
        language: i18n.language.toUpperCase() || 'EN',
        password: password.trim(),
        username
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
            text1: getTranslatedServerErrorMessages(data?.error),
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
    }
  };

  const handleUsernameChange = (e: string) => setUsername(e);

  const validateData = () => {
    if (!validateEmail(email)) {
      Toast.show({
        text1: t('toastErrorInvalidEmail'),
        type: 'error'
      });
      return false;
    }

    if (password.length < 8) {
      Toast.show({
        props: {
          text1FontSize: 14
        },
        text1: t('toastErrorInvalidPasswordTooShort'),
        type: 'error'
      });
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      Toast.show({
        props: {
          text1FontSize: 14
        },
        text1: t('toastErrorInvalidPasswordNoUpperCaseLetter'),
        type: 'error'
      });
      return false;
    }

    if (!/[0-9]/.test(password)) {
      Toast.show({
        props: {
          text1FontSize: 14
        },
        text1: t('toastErrorInvalidPasswordNoNumber'),
        type: 'error'
      });
      return false;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      Toast.show({
        props: {
          text1FontSize: 14
        },
        text1: t('toastErrorInvalidPasswordNoSpecialChar'),
        type: 'error'
      });
      return false;
    }

    if (password !== confirmationPassword) {
      Toast.show({
        props: {
          text1FontSize: 14
        },
        text1: t('toastErrorInvalidPasswordDoNotMatch'),
        type: 'error'
      });
      return false;
    }

    return true;
  };

  const isSubmitBtnDisabled =
    email.trim().length === 0 ||
    password.trim().length === 0 ||
    confirmationPassword.trim().length === 0 ||
    password.trim() !== confirmationPassword.trim();

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.PRIMARY, flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          backgroundColor: COLORS.PRIMARY,
          flex: 1,
          gap: 40
        }}
        enableOnAndroid={true}
        extraScrollHeight={180}
      >
        <Title
          customStyles={{
            container: {
              backgroundColor: 'transparent',
              marginTop: 30
            },
            content: {
              fontSize: 48,
              letterSpacing: 3,
              textShadowColor: 'rgba(0, 0, 0, 0.4)',
              textShadowOffset: { height: 3, width: 3 },
              textShadowRadius: 6
            }
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
            onChangeText={handleUsernameChange}
            placeholderText={`${t('displayName')} (${t('optional')})`}
          />
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
          />
          <CustomTextInput
            autoCapitalize="none"
            hashText
            onChangeText={handleConfirmationPasswordChange}
            placeholderText={t('confirmPassword')}
          />
        </View>
        <CustomButton
          customStyles={{
            container: {
              alignSelf: 'center',
              marginTop: 10,
              width: 240
            }
          }}
          isDisabled={isSubmitBtnDisabled}
          onPress={handleSubmit}
          title={t('signUp')}
        />
        <View style={styles.paragraphContainer}>
          <Text style={styles.paragraph}>
            {t('alreadyHaveAccount')}{' '}
            <Link style={styles.link} to={{ screen: 'Login' }}>
              {t('signIn')}!
            </Link>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
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
    gap: 20,
    height: 160,
    width: '60%'
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
  }
});

export default withErrorBoundary(SignUpScreen);
