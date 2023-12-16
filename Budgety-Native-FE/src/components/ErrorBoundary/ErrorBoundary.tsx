import ErrorScreen from '../../screens/ErrorScreen/ErrorScreen';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  navigation?: any;
}

interface IState {
  hasError: boolean;
}

class ErrorBoundary extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): IState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen navigation={this.props.navigation} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
