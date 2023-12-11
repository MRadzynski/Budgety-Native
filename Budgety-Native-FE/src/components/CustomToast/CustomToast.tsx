import { COLORS } from '../../styles/Colors';
import { useTranslation } from 'react-i18next';
import Toast, {
  BaseToastProps,
  ErrorToast,
  SuccessToast
} from 'react-native-toast-message';

type TCustomProps = {
  props: {
    text1FontSize?: number;
    text2FontSize?: number;
  };
};

const calculateTextNumberOfLines = (text: string): number => {
  const charCount = text.length;

  return Math.ceil(charCount / 30);
};

const calculateToastHeight = (
  text1: string,
  text2: string,
  fontSizeText1: number,
  fontSizeText2: number,
  lang: string
): number => {
  const numOfLinesText1 = calculateTextNumberOfLines(text1);
  const numOfLinesText2 = calculateTextNumberOfLines(text2);
  const padding = 10;

  const langMultiplier = lang === 'ru' ? 1.5 : 1;

  return (
    numOfLinesText1 * fontSizeText1 * langMultiplier +
    numOfLinesText2 * fontSizeText2 * langMultiplier +
    2 * padding
  );
};

const CustomToast = () => {
  const { i18n } = useTranslation();

  const toastConfig = {
    error: (props: BaseToastProps & TCustomProps) => (
      <ErrorToast
        {...props}
        contentContainerStyle={{
          //backgroundColor: COLORS.ERROR,
          backgroundColor: '#F15455',
          borderRadius: 8,
          height: calculateToastHeight(
            props.text1 || '',
            props.text2 || '',
            props?.props?.text1FontSize || 17,
            props?.props?.text2FontSize || 10,
            i18n.language
          ),
          margin: 0,
          minHeight: 60,
          padding: 0
        }}
        style={{
          borderLeftWidth: 0,
          borderRadius: 12
        }}
        text1NumberOfLines={calculateTextNumberOfLines(props.text1 || '')}
        text1Style={{
          color: COLORS.WHITE_SHADE,
          fontSize: props?.props?.text1FontSize || 17
        }}
        text2NumberOfLines={calculateTextNumberOfLines(props.text2 || '')}
        text2Style={{
          color: COLORS.WHITE_SHADE,
          fontSize: props?.props?.text2FontSize || 12
        }}
      />
    ),
    success: (props: BaseToastProps & TCustomProps) => (
      <SuccessToast
        {...props}
        contentContainerStyle={{
          backgroundColor: COLORS.SUCCESS,
          borderRadius: 8,
          margin: 0,
          padding: 0
        }}
        style={{
          borderLeftWidth: 0,
          borderRadius: 12
        }}
        text1NumberOfLines={calculateTextNumberOfLines(props.text1 || '')}
        text1Style={{
          color: COLORS.WHITE_SHADE,
          fontSize: props?.props?.text1FontSize || 17
        }}
        text2NumberOfLines={calculateTextNumberOfLines(props.text2 || '')}
        text2Style={{
          color: COLORS.WHITE_SHADE
        }}
      />
    )
  };

  return <Toast config={toastConfig} visibilityTime={2500} />;
};

export default CustomToast;
