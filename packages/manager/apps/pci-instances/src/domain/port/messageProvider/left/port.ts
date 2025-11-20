export type MessageProviderPort = {
  getMessage: (key: string, params?: Record<string, unknown>) => string;
};
