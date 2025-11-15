import { SetupServer, setupServer } from 'msw/node';

declare global {
   
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