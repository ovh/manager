/**
 * Wait for x miliseconds (30seconds by default)
 */
export const sleep = (timeout = 30000) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve('test');
    }, timeout),
  );
