/**
 * Wait for x miliseconds (30seconds by default)
 */
export const sleep = (timeout = 30_000) =>
  new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, timeout),
  );
