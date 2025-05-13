export const allSettledSequential = (funcs: Array<() => Promise<unknown>>) =>
  funcs.reduce(
    (promise, func) =>
      promise.then((result) =>
        func()
          .then((value) => result.concat([{ status: 'fulfilled', value }]))
          .catch((reason) => result.concat([{ status: 'rejected', reason }])),
      ),
    Promise.resolve([]),
  );
