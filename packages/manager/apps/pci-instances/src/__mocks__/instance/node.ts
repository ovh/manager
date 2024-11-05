import { setupServer } from 'msw/node';
import { instancesHandlers, TInstancesServerResponse } from './handlers';

export const setupInstancesServer = (response: TInstancesServerResponse[]) => {
  const server = setupServer(...instancesHandlers(response));
  server.listen({
    onUnhandledRequest: 'error',
  });
  return server;
};
