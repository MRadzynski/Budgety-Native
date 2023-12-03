import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { Image, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Link } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
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
  const [email, setEmail] = useState('');

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

        if (data.error) {
          return Toast.show({
            text1: data.error,
            type: 'error',
            visibilityTime: 2500
          });
        }

        if (data.message === 'Email was been sent, please check your inbox') {
          Toast.show({
            text1: data.message,
            type: 'success',
            visibilityTime: 2500
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          Toast.show({
            text1: error.message,
            type: 'error',
            visibilityTime: 2500
          });
        } else {
          Toast.show({
            text1: 'Something went wrong',
            type: 'error',
            visibilityTime: 2500
          });
        }
      }
    } else {
      Toast.show({
        text1: 'Email is not valid',
        type: 'error',
        visibilityTime: 2500
      });
    }
  };

  const handleEmailChange = (e: string) => setEmail(e);

  const isSubmitBtnDisabled = email.trim().length === 0;

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
          <Text style={styles.infoText}>
            Enter your email for instructions on resetting your password
          </Text>
          <CustomTextInput
            onChangeText={handleEmailChange}
            placeholderText="Email"
            type="email-address"
          />
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
          onPress={handleApply}
          title="Reset Password"
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
