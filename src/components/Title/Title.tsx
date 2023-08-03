import { COLORS } from '../../styles/Colors';
import { StyleSheet, Text, View } from 'react-native';

interface IProps {
  customStyles?: ITitleCustomStyle;
  text: string;
}

interface ITitleCustomStyle {
  container?: {};
  content?: {};
}

const Title = ({ customStyles, text }: IProps) => {
  const containerStyle = customStyles?.container || {};
  const contentStyle = customStyles?.content || {};

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.content, contentStyle]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    color: COLORS.WHITE_SHADE,
    fontSize: 20
  }
});

export default Title;
