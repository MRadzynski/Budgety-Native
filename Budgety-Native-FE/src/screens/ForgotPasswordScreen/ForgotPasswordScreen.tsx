import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { Image, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Link } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withErrorBoundary } from '../../hoc/withErrorBoundary';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import Title from '../../components/Title/Title';
import Toast from 'react-native-toast-message';

const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.trim().toLowerCase());
};

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const { i18n, t } = useTranslation();

  const getTranslatedServerErrorMessages = (message: string) => {
    switch (message) {
      case 'There is no user with given email address':
        return t('toastErrorNoUserWithGivenEmail');
      default:
        return t('toastErrorSomethingWentWrong');
    }
  };

  const handleApply = async () => {
    if (validateEmail(email)) {
      const url = `${API_URL}/api/user/forgot-password`;
      const options = {
        body: JSON.stringify({
          email: email.trim().toLowerCase()
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (data?.error) {
          return Toast.show({
            props: {
              text1FontSize: 15
            },
            text1: getTranslatedServerErrorMessages(data.error),
            type: 'error'
          });
        }

        if (data?.message === 'Email was been sent, please check your inbox') {
          Toast.show({
            props: {
              text1FontSize: i18n.language === 'ru' ? 13 : 15
            },
            text1: t('toastSuccessEmailSent'),
            type: 'success'
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
    } else {
      Toast.show({
        text1: t('toastErrorInvalidEmail'),
        type: 'error'
      });
    }
  };

  const handleEmailChange = (e: string) => setEmail(e);

  const isSubmitBtnDisabled = email.trim().length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.keyboardContentContainer}
        enableOnAndroid={true}
        extraScrollHeight={180}
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
          <Text style={styles.infoText}>{t('forgotPasswordMsg')}</Text>
          <CustomTextInput
            onChangeText={handleEmailChange}
            placeholderText={t('email')}
            type="email-address"
          />
        </View>
        <CustomButton
          customStyles={{
            container: {
              ...styles.buttonContainer,
              width: i18n.language === 'fr' ? 260 : 240
            }
          }}
          isDisabled={isSubmitBtnDisabled}
          onPress={handleApply}
          title={t('resetPassword')}
        />
        <View style={styles.paragraphContainer}>
          <Text style={styles.paragraph}>
            {t('doNotHaveAccount')}{' '}
            <Link style={styles.link} to={{ screen: 'SignUp' }}>
              {t('signUp')}
            </Link>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center'
  },
  container: {
    backgroundColor: COLORS.PRIMARY,
    flex: 1
  },
  image: {
    alignItems: 'center',
    height: 220,
    justifyContent: 'center',
    width: '100%'
  },
  infoText: {
    color: COLORS.WHITE_SHADE,
    fontSize: 16,
    textAlign: 'center'
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

export default withErrorBoundary(ForgotPasswordScreen);
