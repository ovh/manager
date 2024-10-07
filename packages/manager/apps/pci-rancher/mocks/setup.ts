import { setupWorker } from 'msw/browser';
import { toMswHandlers } from './utils';
import { getRancherMocks } from './handlers';

export const setupMocks = async () =>
  setupWorker(...toMswHandlers(getRancherMocks())).start({
    onUnhandledRequest: 'bypass',
  });
