import { setupWorker } from 'msw/browser';
import { toMswHandlers } from '../../../../../playwright-helpers/msw';
import { getConfig } from './handlers';

export const setupMocks = async () =>
  setupWorker(
    ...toMswHandlers(
      getConfig({
        nbVs: 19,
        delayedOrders: true,
        deliveringVrackServicesOrders: true,
        deliveringVrackOrders: false,
        isAuthMocked: true,
        updateServicesKo: true,
      }),
    ),
  ).start({
    onUnhandledRequest: 'bypass',
  });
