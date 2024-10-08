import { JsonBodyType } from 'msw';
import { setupServer } from 'msw/node';
import { instancesHandlers } from './handlers';

export const setupInstanceServer = <T extends JsonBodyType>(
  mockedResponsePayload?: T,
) => {
  const server = setupServer(...instancesHandlers(mockedResponsePayload));
  server.listen({
    onUnhandledRequest: 'error',
  });
  return server;
};
