import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { Image, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import Title from '../../components/Title/Title';
import Toast from 'react-native-toast-message';

interface IProps {
  navigation: any;
}

type TParamList = {
  ResetPasswordScreen: {
    token: string;
  };
};

const ResetPasswordScreen = ({ navigation }: IProps) => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');

  const { params } = useRoute<RouteProp<TParamList, 'ResetPasswordScreen'>>();

  const handleApply = async () => {
    if (validateData() && params?.token) {
      const url = `${API_URL}/api/user/reset-password`;
      const options = {
        body: JSON.stringify({
          password: password.trim(),
          token: params.token
        }),
        headers: {
          Authorization: `Bearer ${params.token}`,
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

        if (data.message === 'Password has been changed') {
          Toast.show({
            text1: 'Password reset successfully',
            type: 'success',
            visibilityTime: 2500
          });

          navigation.navigate('Login');
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
    }
  };

  const handleConfirmPasswordChange = (e: string) => setConfirmPassword(e);

  const handlePasswordChange = (e: string) => setPassword(e);

  const validateData = () => {
    if (password.length < 8) {
      Toast.show({
        props: {
          text1FontSize: 12
        },
        text1: 'Password should contain at least 8 characters',
        type: 'error',
        visibilityTime: 2500
      });
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      Toast.show({
        props: {
          text1FontSize: 12
        },
        text1: 'Password should contain at least 1 uppercase letter',
        type: 'error',
        visibilityTime: 2500
      });
      return false;
    }

    if (!/[0-9]/.test(password)) {
      Toast.show({
        props: {
          text1FontSize: 12
        },
        text1: 'Password should contain at least 1 number',
        type: 'error',
        visibilityTime: 2500
      });
      return false;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      Toast.show({
        props: {
          text1FontSize: 11
        },
        text1: 'Password should contain at least 1 special character',
        type: 'error',
        visibilityTime: 2500
      });
      return false;
    }

    if (password !== confirmPassword) {
      Toast.show({
        props: {
          text1FontSize: 12
        },
        text1: 'Passwords do not match',
        type: 'error',
        visibilityTime: 2500
      });
      return false;
    }

    return true;
  };

  const isSubmitBtnDisabled =
    password.trim().length === 0 && confirmPassword.trim().length === 0;

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.PRIMARY, flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          backgroundColor: COLORS.PRIMARY,
          flex: 1,
          gap: 50
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
          <Text style={styles.infoText}>Enter your new password</Text>
          <CustomTextInput
            hashText
            onChangeText={handlePasswordChange}
            placeholderText="New password"
            type="default"
          />
          <CustomTextInput
            hashText
            onChangeText={handleConfirmPasswordChange}
            placeholderText="Confirm new password"
            type="default"
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
    gap: 40,
    height: 140,
    width: '60%'
  },
  link: {
    color: COLORS.SECONDARY,
    fontSize: 16,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid'
  }
});

export default ResetPasswordScreen;