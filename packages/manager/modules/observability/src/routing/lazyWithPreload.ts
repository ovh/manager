import { lazy } from 'react';

export type LazyWithPreload<
  T extends React.ComponentType<any>
> = React.LazyExoticComponent<T> & {
  preload: () => void;
};

export const lazyWithPreload = <T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
): LazyWithPreload<T> => {
  const Component = lazy(factory) as LazyWithPreload<T>;
  Component.preload = factory; // can be called to preload the module
  return Component;
};
