const LOCAL_STORAGE_KEY = 'MANAGER_SHELL_DEBUG';
const LOG_PREFIX = '[MOCK-ADAPTER]';

const isDebugEnabled = (): boolean => {
  const debug = localStorage.getItem(LOCAL_STORAGE_KEY);
  return debug !== null && ['true', '1'].includes(debug);
};

export const mockLogger = {
  log: (...args: unknown[]): void => {
    if (isDebugEnabled()) {
      console.log(LOG_PREFIX, ...args);
    }
  },
  info: (...args: unknown[]): void => {
    if (isDebugEnabled()) {
      console.info(LOG_PREFIX, ...args);
    }
  },
  warn: (...args: unknown[]): void => {
    if (isDebugEnabled()) {
      console.warn(LOG_PREFIX, ...args);
    }
  },
  error: (...args: unknown[]): void => {
    if (isDebugEnabled()) {
      console.error(LOG_PREFIX, ...args);
    }
  },
  debug: (...args: unknown[]): void => {
    if (isDebugEnabled()) {
      console.debug(LOG_PREFIX, ...args);
    }
  },
};

export default mockLogger;
