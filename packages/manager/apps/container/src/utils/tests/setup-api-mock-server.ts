import { SetupServer, setupServer } from 'msw/node';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var server: SetupServer;
}

const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });

  delete global.server;
  global.server = server;
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  server.resetHandlers();
});