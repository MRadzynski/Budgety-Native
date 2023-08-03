import { COLORS } from '../../styles/Colors';
import { KeyboardTypeOptions, StyleSheet, TextInput, View } from 'react-native';

interface IProps {
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  customStyles?: ITextInputCustomStyle;
  hashText?: boolean;
  onChangeText: (event: string) => void;
  placeholderText: string;
  text?: string;
  type?: KeyboardTypeOptions;
}

interface ITextInputCustomStyle {
  container?: {};
  content?: {};
}

const CustomTextInput = ({
  autoCapitalize,
  customStyles,
  hashText,
  onChangeText,
  placeholderText,
  type = 'default'
}: IProps) => {
  const containerStyle = customStyles?.container || {};
  const contentStyle = customStyles?.content || {};

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        autoCapitalize={autoCapitalize}
        cursorColor={`${COLORS.WHITE_SHADE}`}
        keyboardType={type}
        onChangeText={onChangeText}
        placeholder={placeholderText}
        placeholderTextColor={`${COLORS.LIGHT_GRAY}`}
        secureTextEntry={hashText}
        style={[styles.textInput, contentStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
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
