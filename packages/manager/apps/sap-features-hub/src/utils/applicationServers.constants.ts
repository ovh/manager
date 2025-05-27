export const SERVER_ROLE = {
  scs: 'SCS',
  ers: 'ERS',
  ci: 'CI',
  di: 'DI',
} as const;

export const APPLICATION_SERVER_ROLES = ['SCS', 'ERS', 'CI', 'DI'] as const;

export type ApplicationServerRole = typeof APPLICATION_SERVER_ROLES[number];
