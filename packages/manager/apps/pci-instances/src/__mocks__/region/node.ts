import { setupServer } from 'msw/node';
import { JsonBodyType } from 'msw';
import { regionHandlers } from './handlers';

export const setupRegionServer = <T extends JsonBodyType>(
  mockedResponsePayload?: T,
) => {
  const server = setupServer(...regionHandlers(mockedResponsePayload));
  server.listen({
    onUnhandledRequest: 'error',
  });
  return server;
};
