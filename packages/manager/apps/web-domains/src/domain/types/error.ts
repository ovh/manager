export interface TUpdateDNSConfigError {
  response?: {
    data?: {
      message?: string;
      class?: string;
      details?: Record<string, any>;
    };
    status?: number;
    statusText?: string;
  };
  message?: string;
}
