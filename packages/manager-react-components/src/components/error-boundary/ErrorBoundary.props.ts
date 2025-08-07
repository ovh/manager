export interface ResponseAPIError {
  message: string;
  stack: string;
  name: string;
  code: string;
  response?: {
    headers?: {
      [key: string]: string;
      'x-ovh-queryid': string;
    };
    data?: {
      message?: string;
    };
  };
}

export interface ErrorBoundaryProps {
  /** application name to redirect */
  redirectionApp: string;
  /** Trigger the preloader hiding */
  isPreloaderHide?: boolean;
  /** Trigger the routes sync beetween shell and the app */
  isRouteShellSync?: boolean;
}
