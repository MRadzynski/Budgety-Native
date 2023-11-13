import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { Image, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Link } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveToSecureStore } from '../../utils/secureStorage';
import { setUser } from '../../slices/userSlice';
import { useAppDispatch } from '../../hooks/redux';
import { useReducer, useRef, useState } from 'react';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import Title from '../../components/Title/Title';

interface IState {
  email: string;
  password: string;
}

type TAction =
  | { type: 'UPDATE_EMAIL'; email: string }
  | { type: 'UPDATE_PASSWORD'; password: string };

const INITIAL_STATE = {
  email: '',
  password: ''
};

const reducer = (state: IState, action: TAction): IState => {
  switch (action.type) {
    case 'UPDATE_EMAIL':
      return { ...state, email: action.email };
    case 'UPDATE_PASSWORD':
      return { ...state, password: action.password };
    default:
      return state;
  }
};

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const [state, reducerDispatch] = useReducer(reducer, INITIAL_STATE);
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();

  const abortControllerRef = useRef<AbortController>(new AbortController());

  const handleEmailChange = (e: string) =>
    reducerDispatch({ email: e, type: 'UPDATE_EMAIL' });

  const handlePasswordChange = (e: string) =>
    reducerDispatch({ password: e, type: 'UPDATE_PASSWORD' });

  const handleSubmit = async () => {
    const url = `${API_URL}/api/user/login`;
    const body = {
      email: state.email.trim().toLowerCase(),
      password: state.password.trim()
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
        setError(data?.error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Something went wrong');
      }
    }
  };

  const isSubmitBtnDisabled =
    state.email.trim().length === 0 || state.password.trim().length === 0;

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.PRIMARY, flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          backgroundColor: COLORS.PRIMARY,
          flex: 1,
          gap: 40
        }}
        enableOnAndroid={true}
        extraScrollHeight={70}
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
            autoCapitalize="none"
            onChangeText={handleEmailChange}
            placeholderText="Email"
            type="email-address"
          />
          <CustomTextInput
            autoCapitalize="none"
            hashText
            onChangeText={handlePasswordChange}
            placeholderText="Password"
            type="default"
          />
          <Link
            style={styles.forgotPasswordText}
            to={{ screen: 'ForgotPassword' }}
          >
            Forgot password?
          </Link>
          {error && <Text style={{ color: COLORS.ERROR }}>{error}</Text>}
        </View>
        <CustomButton
          customStyles={{
            container: {
              alignSelf: 'center',
              marginTop: 60,
              width: 240
            }
          }}
          isDisabled={isSubmitBtnDisabled}
          onPress={handleSubmit}
          title="Sign In"
        />
        <View style={styles.paragraphContainer}>
          <Text style={styles.paragraph}>
            Don't have an account?{' '}
            <Link style={styles.link} to={{ screen: 'SignUp' }}>
              Sign Up!
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
    marginBottom: '5%',
    textAlign: 'center'
  }
});

export default LoginScreen;
