export type ApiVersion = 'v2' | 'v6';

export type JsonRequestOptions = {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  disableCache?: boolean;
};

export type ApiError = {
  response?: {
    status?: number;
    data?: unknown;
  };
};
