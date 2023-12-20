import { COLORS } from '../../styles/Colors';
import { generateBoxShadowStyle } from '../../utils/helpers';
import { ICON_NAMES } from '../../data/iconNames';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

interface IProps {
  bgColor: string;
  isVisible: boolean;
  onApply: (color: string) => void;
  onClose: () => void;
}

const IconPickerModal = ({ bgColor, isVisible, onApply, onClose }: IProps) => {
  const handleClick = (iconName: string) => () => {
    onApply(iconName);
    onClose();
  };

  return (
    <Modal transparent visible={isVisible}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.overlay}
      >
        <View onStartShouldSetResponder={_ => true} style={styles.container}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {ICON_NAMES.map(iconName => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={iconName}
                onPress={handleClick(iconName)}
                style={[styles.iconContainer, { backgroundColor: bgColor }]}
              >
                <MaterialIcons color="white" name={iconName} size={32} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE_SHADE,
    borderRadius: 16,
    maxHeight: '60%',
    width: '80%'
  },
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    padding: 24
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
    ...generateBoxShadowStyle(2, 2, '#000', 0.1, 1, 2)
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.90)',
    flex: 1,
    gap: 16,
    justifyContent: 'center'
  }
});

export default IconPickerModal;
