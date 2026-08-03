import { SetupServer } from 'msw/node';

const mswServer = () => (global as unknown as { server: SetupServer }).server;

export const watchApiCalls = (pathFragment: string): string[] => {
  const calls: string[] = [];

  mswServer().events.on('request:start', ({ request }) => {
    if (request.url.includes(pathFragment)) {
      calls.push(request.url);
    }
  });

  return calls;
};

export const stopWatchingApiCalls = () => mswServer().events.removeAllListeners();
