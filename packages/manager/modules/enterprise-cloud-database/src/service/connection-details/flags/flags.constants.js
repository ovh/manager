export const COMMANDS = {
  postgresql: {
    connect: 'psql',
    restore: 'pg_restore',
  },
};

export const COMMANDS_LIST = {
  CONNECT: 'connect',
  RESTORE: 'restore',
};

export const PARAMETERS = {
  DATABASE: 'postgres',
  MASKED_PASSWORD: '********',
  SSL_MODE: 'require',
  USERNAME: 'postgres',
};

export default {
  COMMANDS,
  COMMANDS_LIST,
  PARAMETERS,
};
