import { COLORS } from '../../styles/Colors';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

interface TextInputCustomStyle {
  container?: {};
  textContent?: {};
}

interface IProps {
  customStyles?: TextInputCustomStyle;
  isDisabled?: boolean;
  onPress: TonPressFunc;
  title: string;
}

type TonPressFunc = (event: GestureResponderEvent) => void;

const CustomButton = ({ customStyles, isDisabled, onPress, title }: IProps) => {
  const containerStyle = customStyles?.container || {};
  const textContentStyle = customStyles?.textContent || {};

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      onPress={onPress}
      style={[styles.container, containerStyle]}
    >
      <Text style={[styles.textContent, textContentStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE_SHADE,
    borderRadius: 25,
    elevation: 10,
    padding: 10,
    shadowColor: '#000'
  },
  textContent: {
    color: COLORS.BLACK_SHADE,
    fontSize: 18,
    textAlign: 'center'
  }
});

export default CustomButton;
