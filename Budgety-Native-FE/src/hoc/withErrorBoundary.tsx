import { NavigationProp } from '@react-navigation/native';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

type TProps = {
  navigation: NavigationProp<any>;
};

export const withErrorBoundary = <P extends object & TProps>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  return props => {
    return (
      <ErrorBoundary navigation={props.navigation}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
};
