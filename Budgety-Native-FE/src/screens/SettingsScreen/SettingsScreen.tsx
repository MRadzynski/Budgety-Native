import { API_URL } from '@env';
import { COLORS } from '../../styles/Colors';
import { deleteFromSecureStore } from '../../utils/secureStorage';
import {
  logout,
  setCurrency,
  setLanguage,
  setUsername
} from '../../slices/userSlice';
import {
  setExpensesCategories,
  setIncomeCategories
} from '../../slices/expenseIncomeSlice';
import { StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withErrorBoundary } from '../../utils/withErrorBoundary';
import CURRENCIES from '../../data/currencies.json';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomModal from '../../components/CustomModal/CustomModal';
import CustomProtectedModal from '../../components/CustomProtectedModal/CustomProtectedModal';
import CustomTextInput from '../../components/CustomTextInput/CustomTextInput';
import Dropdown from '../../components/Dropdown/Dropdown';
import LANGUAGES from '../../data/languages.json';
import Title from '../../components/Title/Title';

interface IDrawerProps {
  navigation: any;
}

const SettingsScreen = ({ navigation }: IDrawerProps) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [isDeletedModalVisible, setIsDeletedModalVisible] = useState(false);
  const [isErasedModalVisible, setIsErasedModalVisible] = useState(false);
  const [usernameTemp, setUsernameTemp] = useState('');

  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(state => state.user.currentUser);

  const { t } = useTranslation();

  const getTranslatedServerErrorMessages = (message: string) => {
    switch (message) {
      case 'Incorrect password':
        return t('toastErrorIncorrectPassword');
      default:
        return t('toastErrorSomethingWentWrong');
    }
  };

  const handleCurrencyChange = async (currency: string) => {
    if (currentUser && 'token' in currentUser) {
      const options = {
        body: JSON.stringify({ currency }),
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        method: 'PATCH'
      };
      const url = `${API_URL}/api/user/update-currency`;

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        data.currency && dispatch(setCurrency(data.currency));
      } catch (error: unknown) {
        if (error instanceof Error) console.error(error.message);
      }
    }
  };

  const handleDeleteUser = async (password: string) => {
    if (currentUser && 'token' in currentUser) {
      const options = {
        body: JSON.stringify({ password }),
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
          'Content-Type': 'application/json'
        },
        method: 'DELETE'
      };
      const url = `${API_URL}/api/user/delete-user`;

      try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (data?.error)
          setErrorMsg(getTranslatedServerErrorMessages(data.error));

        if (data?.message === 'User deleted') {
          setIsDeletedModalVisible(false);
          dispatch(logout());
          await deleteFromSecureStore('user');
        }
      } catch (error: unknown) {
        if (error instanceof Error) console.error(error.message);
      }
    }
  };

  const handleEraseUserData = async () => {
    if (currentUser && 'token' in currentUser) {
      const options = {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
          'Content-Type': 'application/json'
        },
        method: 'DELETE'
      };
      const url = `${API_URL}/api/finance/erase-all-data`;

      try {
        const response = await fetch(url, options);
        const data = await response.json();

        data.expenses && dispatch(setExpensesCategories(data.expenses));
        data.income && dispatch(setIncomeCategories(data.income));
      } catch (error: unknown) {
        if (error instanceof Error) console.error(error.message);
      }
    }
  };

  const handleLanguageChange = async (language: string) => {
    if (currentUser && 'token' in currentUser) {
      const options = {
        body: JSON.stringify({ language }),
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        method: 'PATCH'
      };
      const url = `${API_URL}/api/user/update-language`;

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        data.language && dispatch(setLanguage(data.language));
      } catch (error: unknown) {
        if (error instanceof Error) console.error(error.message);
      }
    }
  };

  const handleUsernameBlur = async () => {
    if (currentUser && 'token' in currentUser) {
      const options = {
        body: JSON.stringify({ username: usernameTemp }),
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        method: 'PATCH'
      };
      const url = `${API_URL}/api/user/update-username`;

      try {
        const response = await fetch(url, options);
        const data = await response.json();

        dispatch(setUsername(data.username));
      } catch (error: unknown) {
        if (error instanceof Error) console.error(error.message);
      }
    }
  };

  const handleUsernameChange = (username: string) => setUsernameTemp(username);

  return (
    <View style={styles.container}>
      <CustomModal
        isVisible={isErasedModalVisible}
        message={t('eraseDataMsg')}
        onConfirm={handleEraseUserData}
        setIsVisible={setIsErasedModalVisible}
      />
      <CustomProtectedModal
        errorMsg={errorMsg}
        isVisible={isDeletedModalVisible}
        message={t('deleteAccountMsg')}
        onConfirm={handleDeleteUser}
        setErrorMsg={setErrorMsg}
        setIsVisible={setIsDeletedModalVisible}
      />
      <Title
        customStyles={{ content: styles.titleContent }}
        text={t('settings')}
      />
      <View style={styles.sectionsContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('user')}</Text>
          <View style={styles.sectionContentContainer}>
            <View style={styles.sectionItemContainer}>
              <Text style={styles.sectionItemTitle}>{t('displayName')}</Text>
              <CustomTextInput
                cursorColor={COLORS.PRIMARY}
                customStyles={{
                  content: styles.textInput,
                  container: styles.textInputContainer
                }}
                defaultValue={
                  'username' in currentUser ? currentUser?.username : undefined
                }
                onBlur={handleUsernameBlur}
                onChangeText={handleUsernameChange}
                placeholderText={t('exampleUsername')}
                placeholderTextColor="#757575"
                selectionColor={COLORS.PRIMARY}
              />
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('preferences')}</Text>
          <View style={styles.sectionContentContainer}>
            <View style={styles.sectionItemContainer}>
              <Text style={styles.sectionItemTitle}>{t('currency')}</Text>
              <Dropdown
                customStyles={{
                  button: styles.dropdownButton,
                  dropdownList: styles.dropdownList
                }}
                data={CURRENCIES}
                defaultSelected={
                  'currency' in currentUser
                    ? CURRENCIES.find(
                        curr => curr.value === currentUser.currency
                      )
                    : CURRENCIES[0]
                }
                onSelect={currency => handleCurrencyChange(currency.value)}
              />
            </View>
            <View style={styles.sectionItemContainer}>
              <Text style={styles.sectionItemTitle}>{t('language')}</Text>
              <Dropdown
                customStyles={{
                  button: styles.dropdownButton,
                  dropdownList: styles.dropdownList
                }}
                data={LANGUAGES}
                defaultSelected={
                  'language' in currentUser
                    ? LANGUAGES.find(
                        lang => lang.value === currentUser.language
                      )
                    : CURRENCIES[0]
                }
                onSelect={language => handleLanguageChange(language.value)}
              />
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, styles.sectionDangerZone]}>
            {t('dangerZone')}
          </Text>
          <View style={styles.sectionContentContainer}>
            <View style={styles.sectionItemContainer}>
              <Text
                style={{
                  height: 40,
                  maxWidth: '60%',
                  textAlignVertical: 'center'
                }}
              >
                {t('eraseData')}
              </Text>
              <CustomButton
                customStyles={{
                  container: styles.dangerZoneButtonContainer,
                  textContent: styles.dangerZoneButtonContent
                }}
                onPress={() => setIsErasedModalVisible(true)}
                title={t('erase')}
              />
            </View>
            <View style={styles.sectionItemContainer}>
              <Text>{t('deleteAccount')}</Text>
              <CustomButton
                customStyles={{
                  container: {
                    ...styles.dangerZoneButtonContainer,
                    backgroundColor: COLORS.ERROR
                  },
                  textContent: {
                    ...styles.dangerZoneButtonContent,
                    color: COLORS.WHITE_SHADE
                  }
                }}
                onPress={() => setIsDeletedModalVisible(true)}
                title={t('delete')}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.PRIMARY,
    flex: 1,
    paddingBottom: 16,
    paddingHorizontal: 32
  },
  dangerZoneButtonContainer: {
    borderRadius: 8,
    elevation: 3,
    height: 40,
    justifyContent: 'center',
    paddingVertical: 6,
    width: 94
  },
  dangerZoneButtonContent: {
    fontSize: 16
  },
  dropdownButton: {
    backgroundColor: COLORS.LIGHT_GRAY,
    elevation: 3,
    width: 100
  },
  dropdownList: {
    height: '25%',
    width: 100
  },
  sectionContainer: {
    backgroundColor: COLORS.WHITE_SHADE,
    borderRadius: 8,
    elevation: 16,
    paddingHorizontal: 24,
    paddingVertical: 16
  },
  sectionContentContainer: {
    gap: 16,
    marginTop: 8
  },
  sectionDangerZone: {
    color: COLORS.ERROR
  },
  sectionItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sectionItemTitle: {
    flex: 1
  },
  sectionTitle: {
    color: COLORS.BLACK_SHADE,
    fontSize: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { height: 1, width: 1 },
    textShadowRadius: 1
  },
  sectionsContainer: {
    flex: 1,
    gap: 32,
    marginTop: 40
  },
  textInput: {
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    color: COLORS.BLACK_SHADE,
    padding: 8,
    width: '75%'
  },
  textInputContainer: {
    alignItems: 'flex-end'
  },
  titleContent: {
    color: COLORS.WHITE_SHADE,
    fontSize: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { height: 3, width: 3 },
    textShadowRadius: 1
  }
});

export default withErrorBoundary(SettingsScreen);
