import { Store } from '@/domain/port/store';

export type Deps = {
  store: Store;
};

export type Reader<D, V> = (deps: D) => V;
