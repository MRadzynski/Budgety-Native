import { COLORS } from '../../styles/Colors';
import { Image, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Link } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReducer } from 'react';
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
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const handleEmailChange = (e: string) =>
    dispatch({ email: e, type: 'UPDATE_EMAIL' });

  const handlePasswordChange = (e: string) =>
    dispatch({ password: e, type: 'UPDATE_PASSWORD' });

  const handleSubmit = () => {
    console.log('Email: ', state.email, 'Password: ', state.password);
  };

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
        </View>
        <CustomButton
          customStyles={{
            container: {
              alignSelf: 'center',
              marginTop: 60,
              width: 240
            }
          }}
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
  headerText: {
    color: '#0066cc',
    fontSize: 40,
    textAlign: 'center'
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
  label: {
    fontSize: 18,
    marginBottom: 5,
    marginLeft: 80,
    marginRight: 80,
    marginTop: 20
  },
  loginButton: {
    backgroundColor: '#0066cc',
    borderRadius: 5,
    marginBottom: 20,
    marginLeft: 80,
    marginRight: 80,
    marginTop: 40
  },
  loginHeader: {
    margin: 20,
    marginTop: 100,
    padding: 20
  },
  loginInputs: {
    marginTop: 150
  },
  link: {
    color: COLORS.SECONDARY,
    fontSize: 16,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid'
  },
  loginText: {
    color: '#ffff',
    fontSize: 16,
    padding: 10,
    textAlign: 'center'
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
