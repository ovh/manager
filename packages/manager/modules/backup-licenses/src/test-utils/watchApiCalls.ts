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

export type WatchedApiRequest = { method: string; url: string; body: unknown };

/**
 * Comme `watchApiCalls`, mais avec le corps des requêtes. Le clone est lu en différé (`resolve…`) :
 * l'attendre à l'émission rendrait l'écouteur asynchrone et l'ordre des appels captés indéterminé,
 * or c'est précisément l'ordre qu'une séquence de commande doit prouver.
 */
export const watchApiRequests = (pathFragment: string): Promise<WatchedApiRequest>[] => {
  const requests: Promise<WatchedApiRequest>[] = [];

  mswServer().events.on('request:start', ({ request }) => {
    if (!request.url.includes(pathFragment)) return;

    const clone = request.clone();
    requests.push(
      (async () => {
        const body: unknown = await clone.json().catch(() => undefined);
        return { method: request.method, url: request.url, body };
      })(),
    );
  });

  return requests;
};

export const resolveApiRequests = (
  requests: Promise<WatchedApiRequest>[],
): Promise<WatchedApiRequest[]> => Promise.all(requests);

export const stopWatchingApiCalls = () => mswServer().events.removeAllListeners();
