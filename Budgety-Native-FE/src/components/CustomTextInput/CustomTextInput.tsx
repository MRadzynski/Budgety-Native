import { COLORS } from '../../styles/Colors';
import {
  Image,
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useState } from 'react';

interface IProps {
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  cursorColor?: string;
  customStyles?: ITextInputCustomStyle;
  defaultValue?: string;
  hashText?: boolean;
  iconVariant?: 'black' | 'white';
  onBlur?: () => void;
  onChangeText?: (event: string) => void;
  placeholderText: string;
  placeholderTextColor?: string;
  selectionColor?: string;
  type?: KeyboardTypeOptions;
  value?: string;
}

interface ITextInputCustomStyle {
  container?: {};
  content?: {};
  icon?: {};
}

const IMAGES: { [key: string]: any } = {
  'eye-close-black': require('../../../assets/eye-close-black.png'),
  'eye-close-white': require('../../../assets/eye-close.png'),
  'eye-open-black': require('../../../assets/eye-open-black.png'),
  'eye-open-white': require('../../../assets/eye-open.png')
};

const CustomTextInput = ({
  autoCapitalize,
  cursorColor = COLORS.WHITE_SHADE,
  customStyles,
  defaultValue,
  hashText,
  iconVariant = 'white',
  onBlur,
  onChangeText,
  placeholderText,
  placeholderTextColor = COLORS.LIGHT_GRAY,
  selectionColor = 'white',
  type = 'default',
  value
}: IProps) => {
  const [icon, setIcon] = useState(`eye-open-${iconVariant}`);
  const [isInputHashed, setIsInputHashed] = useState(hashText);

  const containerStyle = customStyles?.container || {};
  const contentStyle = customStyles?.content || {};
  const iconStyle = customStyles?.icon || {};

  const handleIconPress = () => {
    setIcon(
      icon === `eye-open-${iconVariant}`
        ? `eye-close-${iconVariant}`
        : `eye-open-${iconVariant}`
    );
    setIsInputHashed(!isInputHashed);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        autoCapitalize={autoCapitalize}
        cursorColor={cursorColor}
        defaultValue={defaultValue}
        keyboardType={type}
        onBlur={onBlur}
        onChangeText={onChangeText}
        placeholder={placeholderText}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={isInputHashed}
        selectionColor={selectionColor}
        style={[styles.textInput, contentStyle]}
        textContentType="oneTimeCode"
        value={value}
      />
      {hashText && value && (
        <TouchableOpacity
          onPress={handleIconPress}
          style={[styles.iconContainer, iconStyle]}
        >
          <Image source={IMAGES[icon]} style={styles.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    position: 'relative'
  },
  icon: {
    height: 24,
    width: 24
  },
  iconContainer: {
    position: 'absolute',
    right: 0
  },
  textInput: {
    alignItems: 'center',
    borderBottomColor: COLORS.WHITE_SHADE,
    borderBottomWidth: 1,
    color: COLORS.WHITE_SHADE,
    height: 40,
    padding: 4,
    width: '100%'
  }
});

export default CustomTextInput;
