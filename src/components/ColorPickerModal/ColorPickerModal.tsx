import { COLORS } from '../../styles/Colors';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useState } from 'react';
import ColorPicker from 'react-native-wheel-color-picker';
import CustomButton from '../CustomButton/CustomButton';

interface IProps {
  defaultColor: string;
  isVisible: boolean;
  onApply: (color: string) => void;
  onClose: () => void;
}

const windowWidth = Dimensions.get('window').width;

const ColorPickerModal = ({
  defaultColor,
  isVisible,
  onApply,
  onClose
}: IProps) => {
  const [color, setColor] = useState(defaultColor);

  const handleApply = () => {
    onApply(color);
    onClose();
  };

  const handleChange = (selectedColor: string) => setColor(selectedColor);

  return (
    <Modal transparent visible={isVisible}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.overlay}
      >
        <View style={styles.contentContainer}>
          <ColorPicker
            color={defaultColor}
            onColorChangeComplete={handleChange}
          />
        </View>
        <CustomButton
          customStyles={{
            container: styles.buttonContainer,
            textContent: styles.buttonContent
          }}
          onPress={handleApply}
          title="Confirm"
        />
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12
  },
  buttonContent: {
    color: COLORS.WHITE_SHADE
  },
  contentContainer: {
    height: windowWidth,
    padding: 32,
    width: windowWidth
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.90)',
    flex: 1,
    gap: 16,
    justifyContent: 'center'
  }
});

export default ColorPickerModal;
