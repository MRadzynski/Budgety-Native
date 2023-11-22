import { COLORS } from '../../styles/Colors';
import { KeyboardTypeOptions, StyleSheet, TextInput, View } from 'react-native';

interface IProps {
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  cursorColor?: string;
  customStyles?: ITextInputCustomStyle;
  defaultValue?: string;
  hashText?: boolean;
  onBlur?: () => void;
  onChangeText: (event: string) => void;
  placeholderText: string;
  placeholderTextColor?: string;
  selectionColor?: string;
  type?: KeyboardTypeOptions;
}

interface ITextInputCustomStyle {
  container?: {};
  content?: {};
}

const CustomTextInput = ({
  autoCapitalize,
  cursorColor = COLORS.WHITE_SHADE,
  customStyles,
  defaultValue,
  hashText,
  onBlur,
  onChangeText,
  placeholderText,
  placeholderTextColor = COLORS.LIGHT_GRAY,
  selectionColor = 'white',
  type = 'default'
}: IProps) => {
  const containerStyle = customStyles?.container || {};
  const contentStyle = customStyles?.content || {};

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
        secureTextEntry={hashText}
        selectionColor={selectionColor}
        style={[styles.textInput, contentStyle]}
        textContentType="oneTimeCode"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  content: {
    color: COLORS.WHITE_SHADE,
    fontSize: 20
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
