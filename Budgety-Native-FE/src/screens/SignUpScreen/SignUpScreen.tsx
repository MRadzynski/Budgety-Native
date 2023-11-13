import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { Image, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Link } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveToSecureStore } from '../../utils/secureStorage';
import { setUser } from '../../slices/userSlice';
import { useRef, useState } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import Title from '../../components/Title/Title';

const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
};

const SignUpScreen = () => {
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const dispatch = useAppDispatch();

  const abortControllerRef = useRef<AbortController>(new AbortController());

  const handleConfirmationPasswordChange = (e: string) =>
    setConfirmationPassword(e);

  const handleEmailChange = (e: string) => setEmail(e);

  const handlePasswordChange = (e: string) => setPassword(e);

  const handleSubmit = async () => {
    setError('');

    if (validateData()) {
      const url = `${API_URL}/api/user/signup`;
      const body = {
        email: email.trim().toLowerCase(),
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
          setError(data?.error);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Something went wrong');
        }
      }
    }
  };

  const handleUsernameChange = (e: string) => setUsername(e);

  const validateData = () => {
    if (!validateEmail(email)) {
      setError('Email is not valid');
      return false;
    }

    if (password.length < 8) {
      setError('Password should contain at least 8 characters');
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password should contain at least 1 uppercase letter');
      return false;
    }

    if (!/[0-9]/.test(password)) {
      setError('Password should contain at least 1 number');
      return false;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      setError('Password should contain at least 1 special character');
      return false;
    }

    if (password !== confirmationPassword) {
      setError('Passwords do not match');
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
            placeholderText="Name (optional)"
          />
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
          />
          <CustomTextInput
            autoCapitalize="none"
            hashText
            onChangeText={handleConfirmationPasswordChange}
            placeholderText="Confirm Password"
          />
          {error && <Text style={{ color: COLORS.ERROR }}>{error}</Text>}
        </View>
        <CustomButton
          customStyles={{
            container: {
              alignSelf: 'center',
              marginTop: 20,
              width: 240
            }
          }}
          isDisabled={isSubmitBtnDisabled}
          onPress={handleSubmit}
          title="Sign Up"
        />
        <View style={styles.paragraphContainer}>
          <Text style={styles.paragraph}>
            Already have an account?{' '}
            <Link style={styles.link} to={{ screen: 'Login' }}>
              Sign In!
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
    marginBottom: '5%',
    textAlign: 'center'
  }
});

export default SignUpScreen;
