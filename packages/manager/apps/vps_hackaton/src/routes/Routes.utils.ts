import type { RouteObject } from 'react-router-dom';

export const getRoot = (): string => {
  const { pathname } = window.location;
  const hashIndex = window.location.href.indexOf('#');
  if (hashIndex !== -1) {
    return pathname;
  }
  return pathname;
};

export const lazyRouteConfig = (
  importFn: () => Promise<{ default: React.ComponentType }>,
): Partial<RouteObject> => ({
  lazy: async () => {
    const { default: Component } = await importFn();
    return { Component };
  },
});
