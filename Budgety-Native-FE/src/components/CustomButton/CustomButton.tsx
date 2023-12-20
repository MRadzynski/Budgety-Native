import { COLORS } from '../../styles/Colors';
import { generateBoxShadowStyle } from '../../utils/helpers';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

interface IProps {
  customStyles?: ITextInputCustomStyle;
  isDisabled?: boolean;
  onPress: TonPressFunc;
  title: string;
}
interface ITextInputCustomStyle {
  container?: {};
  textContent?: {};
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
      style={[styles.container, containerStyle, isDisabled && { opacity: 0.6 }]}
    >
      <Text style={[styles.textContent, textContentStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE_SHADE,
    borderRadius: 25,
    padding: 10,
    ...generateBoxShadowStyle(3, 4, '#000', 0.2, 3, 10)
  },
  textContent: {
    color: COLORS.BLACK_SHADE,
    fontSize: 18,
    textAlign: 'center'
  }
});

export default CustomButton;
