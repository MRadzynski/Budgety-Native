import { COLORS } from '../../styles/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomButton from '../CustomButton/CustomButton';
import CustomTextInput from '../CustomTextInput/CustomTextInput';

interface IProps {
  errorMsg: string;
  isVisible: boolean;
  message: string;
  onConfirm: (...args: any) => void;
  setErrorMsg: (errorMsg: string) => void;
  setIsVisible: (isVisible: boolean) => void;
}

const CustomProtectedModal = ({
  errorMsg,
  isVisible,
  message,
  onConfirm,
  setErrorMsg,
  setIsVisible
}: IProps) => {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isVisible) {
      setPassword('');
      setErrorMsg('');
    }
  }, [isVisible]);

  const { t } = useTranslation();

  const handleClose = () => setIsVisible(false);

  const handleConfirm = () => onConfirm(password);

  const handlePasswordChange = (value: string) => setPassword(value);

  return (
    <Modal transparent visible={isVisible}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleClose}
        style={styles.overlay}
      >
        <View onStartShouldSetResponder={_ => true} style={styles.container}>
          <View style={styles.exitContainer}>
            <MaterialIcons
              color={COLORS.BLACK_SHADE}
              name="close"
              onPress={handleClose}
              size={24}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.textContent}>{message}</Text>
            <Text style={styles.textContent}>{t('areYouSure')}</Text>
          </View>
          <CustomTextInput
            customStyles={{
              container: styles.inputContainer,
              content: styles.inputContent
            }}
            hashText
            onChangeText={handlePasswordChange}
            placeholderText={t('enterPassword')}
            value={password}
          />
          <Text style={styles.errorMsg}>{errorMsg || ''}</Text>
          <View style={styles.buttonsContainer}>
            <CustomButton
              customStyles={{
                container: styles.buttonContainer,
                textContent: styles.buttonContent
              }}
              isDisabled={!password?.trim().length}
              onPress={handleConfirm}
              title={t('confirm')}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: COLORS.ERROR,
    borderRadius: 8,
    minWidth: 90
  },
  buttonContent: {
    color: COLORS.WHITE_SHADE,
    fontSize: 14
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    position: 'relative',
    width: '80%'
  },
  errorMsg: {
    color: COLORS.ERROR,
    textAlign: 'center'
  },
  exitContainer: {
    position: 'absolute',
    right: 6,
    top: 6
  },
  infoContainer: {
    gap: 4
  },
  inputContainer: {
    marginBottom: 6,
    marginTop: 16
  },
  inputContent: {
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    borderWidth: 1,
    color: COLORS.BLACK_SHADE,
    fontSize: 16,
    textAlign: 'center'
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.90)',
    flex: 1,
    justifyContent: 'center'
  },
  textContent: {
    textAlign: 'center'
  }
});

export default CustomProtectedModal;
