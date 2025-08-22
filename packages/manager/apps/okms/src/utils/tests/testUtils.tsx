import { Handler } from '@ovh-ux/manager-core-test-utils';

// Sets all handlers to 0ms delay
// This avoids the global utils function to set a default delay of 1000ms
export const removeHandlersDelay = (handlers: Handler[]): Handler[] => {
  return handlers.map((handler) => {
    return { ...handler, delay: 0 };
  });
};
