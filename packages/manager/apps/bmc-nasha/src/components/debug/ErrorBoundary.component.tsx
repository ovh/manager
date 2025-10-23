import React, { Component, ErrorInfo, ReactNode } from 'react';
import { OdsCard, OdsText } from '@ovhcloud/ods-components/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <OdsCard color="neutral">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              Une erreur est survenue
            </h2>
            <div className="space-y-2">
              <OdsText preset="paragraph" color="neutral">
                <strong>Erreur:</strong> {this.state.error?.message}
              </OdsText>
              <details className="mt-4">
                <summary className="cursor-pointer font-semibold">
                  Détails techniques
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
                  {this.state.error?.stack}
                </pre>
                {this.state.errorInfo && (
                  <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            </div>
          </div>
        </OdsCard>
      );
    }

    return this.props.children;
  }
}
