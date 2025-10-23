import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  isPreloaderHide?: boolean;
  isRouteShellSync?: boolean;
  redirectionApp?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-red-600">
            Une erreur est survenue
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>Erreur:</strong> {this.state.error?.message}
            </p>
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
      );
    }

    return this.props.children || null;
  }
}

export default ErrorBoundary;
