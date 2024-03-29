import { COLORS } from '../../styles/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CustomButton from '../CustomButton/CustomButton';

interface IProps {
  isVisible: boolean;
  message: string;
  onConfirm: (...args: any) => void;
  setIsVisible: (isVisible: boolean) => void;
}

const CustomModal = ({
  isVisible,
  message,
  onConfirm,
  setIsVisible
}: IProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (Platform.OS === 'android') {
      isVisible
        ? StatusBar.setBackgroundColor('rgba(0,0,0,0.9)')
        : StatusBar.setBackgroundColor('transparent');
    }
  }, [isVisible]);

  const handleClose = () => setIsVisible(false);

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

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
          <View style={styles.buttonsContainer}>
            <CustomButton
              customStyles={{
                container: {
                  ...styles.buttonContainer,
                  backgroundColor: COLORS.ERROR
                },
                textContent: {
                  ...styles.buttonContent,
                  color: COLORS.WHITE_SHADE
                }
              }}
              onPress={handleConfirm}
              title={t('yes')}
            />
            <CustomButton
              customStyles={{
                container: styles.buttonContainer,
                textContent: styles.buttonContent
              }}
              onPress={handleClose}
              title={t('no')}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 8,
    minWidth: 90
  },
  buttonContent: {
    fontSize: 14
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center'
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 24,
    position: 'relative',
    width: '80%'
  },
  exitContainer: {
    position: 'absolute',
    right: 6,
    top: 6
  },
  infoContainer: {
    gap: 4
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
    flex: 1,
    justifyContent: 'center'
  },
  textContent: {
    textAlign: 'center'
  }
});

export default CustomModal;
