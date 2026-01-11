export type ApiConfigMode = 'mock' | 'api';

export const apiConfig = {
  mode: 'mock' as ApiConfigMode,
} as const;
