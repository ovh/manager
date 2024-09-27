import { setupServer } from 'msw/node';
import { JsonBodyType } from 'msw';
import { catalogHandlers } from './handlers';

export const setupCatalogServer = <T extends JsonBodyType>(
  mockedResponsePayload?: T,
) => {
  const server = setupServer(...catalogHandlers(mockedResponsePayload));
  server.listen({
    onUnhandledRequest: 'error',
  });
  return server;
};
